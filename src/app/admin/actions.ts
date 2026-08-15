"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerClient } from "@/lib/supabase/server";
import { requireAdmin, canEdit } from "@/lib/auth/adminSession";
import { logger } from "@/lib/observability/logger";
import { leadStatuses } from "@/config/pipeline";
import type { LeadStatusDb } from "@/lib/supabase/types";

/**
 * Admin server actions.
 *
 * Every one of these re-authorises: a server action is a public HTTP endpoint,
 * so "the button is only rendered for admins" is not a security control.
 * Writes go through the user's own session, which means RLS applies too.
 */

export type ActionResult = { ok: boolean; error?: string };

const statusValues = leadStatuses.map((s) => s.value) as [LeadStatusDb, ...LeadStatusDb[]];

const uuid = z.string().uuid();

async function authorise(): Promise<
  { ok: true; session: Awaited<ReturnType<typeof requireAdmin>> } | { ok: false; error: string }
> {
  const session = await requireAdmin();
  if (!canEdit(session)) {
    return { ok: false, error: "Din bruger har kun læseadgang." };
  }
  return { ok: true, session };
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { ok: false, error: "Udfyld både e-mail og adgangskode." };
  }

  let supabase;
  try {
    supabase = await getServerClient();
  } catch {
    return { ok: false, error: "Systemet er ikke konfigureret til login endnu." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    // Deliberately vague: distinguishing "wrong password" from "no such user"
    // hands an attacker a way to enumerate valid accounts.
    logger.warn("admin_login_failed", { reason: error?.message ?? "no_user" });
    return { ok: false, error: "Forkert e-mail eller adgangskode." };
  }

  // Authentication is not authorisation — the user must also be active staff.
  const { data: profile } = await supabase
    .from("admin_users")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile?.is_active) {
    await supabase.auth.signOut();
    logger.warn("admin_login_not_authorised", { user_id: data.user.id });
    return { ok: false, error: "Din bruger har ikke adgang til systemet." };
  }

  logger.info("admin_login_success", { user_id: data.user.id });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Lead mutations
// ---------------------------------------------------------------------------

export async function updateLeadStatus(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const parsed = z
    .object({ leadId: uuid, status: z.enum(statusValues) })
    .safeParse({
      leadId: formData.get("leadId"),
      status: formData.get("status"),
    });

  if (!parsed.success) return { ok: false, error: "Ugyldig status." };

  const supabase = await getServerClient();
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.leadId);

  if (error) {
    logger.error("lead_status_update_failed", { message: error.message });
    return { ok: false, error: "Kunne ikke opdatere status." };
  }

  await supabase.from("lead_events").insert({
    lead_id: parsed.data.leadId,
    event_type: "status_changed",
    actor_id: auth.session.userId,
    payload: { status: parsed.data.status },
  });

  logger.info("lead_status_changed", {
    lead_id: parsed.data.leadId,
    status: parsed.data.status,
    actor_id: auth.session.userId,
  });

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

export async function addLeadNote(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const parsed = z
    .object({ leadId: uuid, body: z.string().trim().min(1, "Skriv en note").max(4000) })
    .safeParse({ leadId: formData.get("leadId"), body: formData.get("body") });

  if (!parsed.success) return { ok: false, error: "Noten er tom." };

  const supabase = await getServerClient();
  const { error } = await supabase.from("lead_notes").insert({
    lead_id: parsed.data.leadId,
    author_id: auth.session.userId,
    body: parsed.data.body,
  });

  if (error) {
    logger.error("lead_note_insert_failed", { message: error.message });
    return { ok: false, error: "Kunne ikke gemme noten." };
  }

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { ok: true };
}

/** Records a contact attempt and moves the lead along the pipeline. */
export async function logContactAttempt(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const parsed = z
    .object({ leadId: uuid, reached: z.enum(["yes", "no"]) })
    .safeParse({ leadId: formData.get("leadId"), reached: formData.get("reached") });

  if (!parsed.success) return { ok: false, error: "Ugyldig handling." };

  const supabase = await getServerClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("contact_attempts, status")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  const reached = parsed.data.reached === "yes";
  const { error } = await supabase
    .from("leads")
    .update({
      contact_attempts: (lead?.contact_attempts ?? 0) + 1,
      last_contacted_at: new Date().toISOString(),
      // Never move a lead backwards: a later attempt on an already-qualified
      // lead should not reset it to "contacted".
      status: reached
        ? lead?.status === "new" || lead?.status === "attempted_contact"
          ? "contacted"
          : lead?.status
        : lead?.status === "new"
          ? "attempted_contact"
          : lead?.status,
    })
    .eq("id", parsed.data.leadId);

  if (error) {
    logger.error("contact_attempt_failed", { message: error.message });
    return { ok: false, error: "Kunne ikke registrere kontaktforsøget." };
  }

  await supabase.from("lead_events").insert({
    lead_id: parsed.data.leadId,
    event_type: reached ? "contact_reached" : "contact_attempted",
    actor_id: auth.session.userId,
  });

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function setFollowUp(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const raw = String(formData.get("followUpAt") ?? "").trim();
  const leadId = uuid.safeParse(formData.get("leadId"));
  if (!leadId.success) return { ok: false, error: "Ugyldigt lead." };

  const supabase = await getServerClient();

  if (!raw) {
    const { error } = await supabase
      .from("leads")
      .update({ next_follow_up_at: null })
      .eq("id", leadId.data);
    if (error) return { ok: false, error: "Kunne ikke fjerne opfølgningen." };
    revalidatePath(`/admin/leads/${leadId.data}`);
    return { ok: true };
  }

  const when = new Date(raw);
  if (Number.isNaN(when.getTime())) return { ok: false, error: "Ugyldig dato." };

  const { error } = await supabase
    .from("leads")
    .update({ next_follow_up_at: when.toISOString(), status: "follow_up" })
    .eq("id", leadId.data);

  if (error) {
    logger.error("follow_up_update_failed", { message: error.message });
    return { ok: false, error: "Kunne ikke sætte opfølgningen." };
  }

  await supabase.from("lead_events").insert({
    lead_id: leadId.data,
    event_type: "follow_up_set",
    actor_id: auth.session.userId,
    payload: { follow_up_at: when.toISOString() },
  });

  revalidatePath(`/admin/leads/${leadId.data}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function bookMeeting(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const parsed = z
    .object({
      leadId: uuid,
      startsAt: z.string().min(1, "Vælg et tidspunkt"),
      durationMinutes: z.coerce.number().int().min(15).max(240),
      type: z.enum(["phone", "video", "physical"]),
    })
    .safeParse({
      leadId: formData.get("leadId"),
      startsAt: formData.get("startsAt"),
      durationMinutes: formData.get("durationMinutes") || 30,
      type: formData.get("type") || "phone",
    });

  if (!parsed.success) return { ok: false, error: "Udfyld tidspunkt og mødeform." };

  const starts = new Date(parsed.data.startsAt);
  if (Number.isNaN(starts.getTime())) return { ok: false, error: "Ugyldigt tidspunkt." };
  const ends = new Date(starts.getTime() + parsed.data.durationMinutes * 60_000);

  const supabase = await getServerClient();
  const { error } = await supabase.from("appointments").insert({
    lead_id: parsed.data.leadId,
    advisor_id: auth.session.userId,
    type: parsed.data.type,
    status: "scheduled",
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    provider: "manual",
  });

  if (error) {
    logger.error("appointment_insert_failed", { message: error.message });
    return { ok: false, error: "Kunne ikke oprette mødet." };
  }

  await supabase
    .from("leads")
    .update({ status: "meeting_booked" })
    .eq("id", parsed.data.leadId);

  await supabase.from("lead_events").insert({
    lead_id: parsed.data.leadId,
    event_type: "meeting_booked",
    actor_id: auth.session.userId,
    payload: { starts_at: starts.toISOString(), type: parsed.data.type },
  });

  logger.info("meeting_booked", {
    lead_id: parsed.data.leadId,
    actor_id: auth.session.userId,
  });

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  revalidatePath("/admin");
  return { ok: true };
}
