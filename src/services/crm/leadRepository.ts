import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { getServerClient } from "@/lib/supabase/server";
import type {
  LeadRow,
  LeadStatusDb,
  LeadNoteRow,
  AppointmentRow,
  LeadEventRow,
} from "@/lib/supabase/types";
import type { LeadInput, AttributionInput } from "@/lib/validation/lead";
import { scoreLead } from "@/lib/scoring/leadScore";
import { logger } from "@/lib/observability/logger";
import { LEAD_CONSENT_SHORT } from "@/components/funnel/consentText";

/**
 * All lead data access lives here.
 *
 * Writes from the public funnel use the service-role client (the visitor has no
 * session). Reads from the CRM use the request-scoped client, so RLS applies and
 * an unauthorised session simply sees nothing.
 */

export type CreateLeadResult = {
  leadId: string;
  score: number;
  temperature: string;
};

/**
 * The exact wording shown next to the consent checkbox. Imported rather than
 * duplicated so the text we store as proof is provably the text the user saw.
 */
const CONSENT_TEXT = LEAD_CONSENT_SHORT;

/**
 * Persists a lead, its company, its consent record and its creation event.
 *
 * The company row is upserted on CVR when we have one, so repeat enquiries from
 * the same business collapse onto one record instead of creating duplicates.
 */
export async function createLead({
  lead,
  ipPrefix,
  userAgent,
  source,
}: {
  lead: LeadInput;
  ipPrefix: string | null;
  userAgent: string | null;
  source: string;
}): Promise<CreateLeadResult> {
  const supabase = getAdminClient();
  const scoring = scoreLead(lead);
  const attribution: Partial<AttributionInput> = lead.attribution ?? {};

  // --- Consent first: if we cannot record the consent, we do not store the lead.
  const { data: consent, error: consentError } = await supabase
    .from("consent_records")
    .insert({
      purpose: "lead_contact",
      consent_text: CONSENT_TEXT,
      consent_version: 1,
      granted: true,
      ip_prefix: ipPrefix,
      user_agent: userAgent?.slice(0, 300) ?? null,
    })
    .select("id")
    .single();

  if (consentError) {
    logger.error("consent_record_failed", { message: consentError.message });
    throw new Error("Kunne ikke registrere samtykke");
  }

  // --- Company (erhverv only) -------------------------------------------
  let companyId: string | null = null;
  if (lead.leadType === "erhverv") {
    if (lead.cvr) {
      const { data: company, error } = await supabase
        .from("companies")
        .upsert(
          {
            name: lead.companyName,
            cvr: lead.cvr,
            industry: lead.industry,
            employee_range: lead.employeesRange,
          },
          { onConflict: "cvr" },
        )
        .select("id")
        .single();
      if (error) {
        logger.warn("company_upsert_failed", { message: error.message });
      } else {
        companyId = company?.id ?? null;
      }
    } else {
      const { data: company, error } = await supabase
        .from("companies")
        .insert({
          name: lead.companyName,
          industry: lead.industry,
          employee_range: lead.employeesRange,
        })
        .select("id")
        .single();
      if (error) {
        logger.warn("company_insert_failed", { message: error.message });
      } else {
        companyId = company?.id ?? null;
      }
    }
  }

  // --- Lead --------------------------------------------------------------
  const { data: created, error: leadError } = await supabase
    .from("leads")
    .insert({
      lead_type: lead.leadType,
      status: "new",
      first_name: lead.firstName,
      last_name: lead.lastName,
      phone: lead.phone,
      email: lead.email,
      company_id: companyId,
      industry: lead.leadType === "erhverv" ? lead.industry : null,
      employees_range: lead.leadType === "erhverv" ? lead.employeesRange : null,
      current_provider: lead.currentProvider ?? null,
      selected_products: lead.selectedProducts,
      primary_goal: lead.primaryGoal,
      preferred_contact_method: lead.preferredContact,
      comment: lead.comment ?? null,
      score: scoring.score,
      temperature: scoring.temperature,
      score_factors: scoring.factors,
      scoring_version: scoring.version,
      assigned_to: null,
      next_follow_up_at: null,
      last_contacted_at: null,
      contact_attempts: 0,
      source,
      landing_page: attribution.landing_page ?? null,
      referrer: attribution.referrer ?? null,
      utm_source: attribution.utm_source ?? null,
      utm_medium: attribution.utm_medium ?? null,
      utm_campaign: attribution.utm_campaign ?? null,
      utm_content: attribution.utm_content ?? null,
      utm_term: attribution.utm_term ?? null,
      gclid: attribution.gclid ?? null,
      fbclid: attribution.fbclid ?? null,
      msclkid: attribution.msclkid ?? null,
      consent_id: consent.id,
      session_id: lead.sessionId ?? null,
    })
    .select("id")
    .single();

  if (leadError || !created) {
    logger.error("lead_insert_failed", { message: leadError?.message });
    throw new Error("Kunne ikke gemme henvendelsen");
  }

  // --- Audit trail. A failure here must not lose the lead. ---------------
  const { error: eventError } = await supabase.from("lead_events").insert({
    lead_id: created.id,
    session_id: lead.sessionId ?? null,
    event_type: "lead_created",
    lead_type: lead.leadType,
    landing_page: attribution.landing_page ?? null,
    payload: {
      score: scoring.score,
      temperature: scoring.temperature,
      products: lead.selectedProducts,
      source,
    },
  });
  if (eventError) logger.warn("lead_event_insert_failed", { message: eventError.message });

  // Backfill the anonymous funnel events with the lead they turned into.
  if (lead.sessionId) {
    const { error: linkError } = await supabase
      .from("lead_events")
      .update({ lead_id: created.id })
      .is("lead_id", null)
      .eq("session_id", lead.sessionId);
    if (linkError) logger.warn("lead_event_link_failed", { message: linkError.message });
  }

  logger.info("lead_created", {
    lead_id: created.id,
    lead_type: lead.leadType,
    score: scoring.score,
    temperature: scoring.temperature,
    product_count: lead.selectedProducts.length,
    utm_source: attribution.utm_source,
    utm_campaign: attribution.utm_campaign,
  });

  return {
    leadId: created.id,
    score: scoring.score,
    temperature: scoring.temperature,
  };
}

/** Anonymous funnel progression. Never contains personal data. */
export async function recordFunnelEvent(input: {
  sessionId: string;
  eventType: string;
  stepId?: string;
  stepIndex?: number;
  leadType?: string;
  landingPage?: string;
}): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("lead_events").insert({
    session_id: input.sessionId,
    event_type: input.eventType,
    step_id: input.stepId ?? null,
    step_index: input.stepIndex ?? null,
    lead_type: (input.leadType as "privat" | "erhverv" | undefined) ?? null,
    landing_page: input.landingPage ?? null,
  });
  if (error) logger.warn("funnel_event_failed", { message: error.message });
}

// ---------------------------------------------------------------------------
// CRM reads — go through the user's session so RLS is enforced.
// ---------------------------------------------------------------------------

export type LeadListFilters = {
  status?: LeadStatusDb;
  temperature?: "low" | "medium" | "high";
  leadType?: "privat" | "erhverv";
  search?: string;
  limit?: number;
};

export async function listLeads(filters: LeadListFilters = {}): Promise<LeadRow[]> {
  const supabase = await getServerClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 100);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.temperature) query = query.eq("temperature", filters.temperature);
  if (filters.leadType) query = query.eq("lead_type", filters.leadType);

  if (filters.search) {
    // Escape PostgREST's or() separators so a search term cannot alter the filter.
    const term = filters.search.replace(/[,()]/g, " ").trim();
    if (term) {
      query = query.or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    logger.error("lead_list_failed", { message: error.message });
    throw new Error("Kunne ikke hente leads");
  }
  return data ?? [];
}

export async function getLead(id: string): Promise<LeadRow | null> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) {
    logger.error("lead_get_failed", { message: error.message, lead_id: id });
    throw new Error("Kunne ikke hente lead");
  }
  return data;
}

export async function getLeadContext(leadId: string): Promise<{
  notes: LeadNoteRow[];
  events: LeadEventRow[];
  appointments: AppointmentRow[];
  company: { id: string; name: string; cvr: string | null; industry: string | null } | null;
}> {
  const supabase = await getServerClient();
  const lead = await getLead(leadId);

  const [notes, events, appointments, company] = await Promise.all([
    supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false }),
    supabase
      .from("lead_events")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("appointments")
      .select("*")
      .eq("lead_id", leadId)
      .order("starts_at", { ascending: false }),
    lead?.company_id
      ? supabase
          .from("companies")
          .select("id, name, cvr, industry")
          .eq("id", lead.company_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  return {
    notes: notes.data ?? [],
    events: events.data ?? [],
    appointments: appointments.data ?? [],
    company: company.data ?? null,
  };
}

/** Counts that drive the "needs action" dashboard. */
export async function getDashboardCounts() {
  const supabase = await getServerClient();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const leadCount = () => supabase.from("leads").select("*", { count: "exact", head: true });

  const [newLeads, uncontacted, hotLeads, followUpsToday, total, won] = await Promise.all([
    leadCount().eq("status", "new"),
    leadCount().in("status", ["new", "attempted_contact"]),
    leadCount().eq("temperature", "high").not("status", "in", "(won,lost)"),
    leadCount()
      .gte("next_follow_up_at", startOfToday.toISOString())
      .lt("next_follow_up_at", endOfToday.toISOString()),
    leadCount(),
    leadCount().eq("status", "won"),
  ]);

  const { count: meetingsToday } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "scheduled")
    .gte("starts_at", startOfToday.toISOString())
    .lt("starts_at", endOfToday.toISOString());

  return {
    newLeads: newLeads.count ?? 0,
    uncontacted: uncontacted.count ?? 0,
    hotLeads: hotLeads.count ?? 0,
    followUpsToday: followUpsToday.count ?? 0,
    meetingsToday: meetingsToday ?? 0,
    total: total.count ?? 0,
    won: won.count ?? 0,
  };
}

/**
 * The four work queues the dashboard is built around.
 *
 * The question a CRM front page must answer is "what do I do now", so these
 * are lists of leads to act on — not totals to look at.
 */
export async function getActionQueues(): Promise<{
  newLeads: LeadRow[];
  followUpsDue: LeadRow[];
  hotOpen: LeadRow[];
  staleUncontacted: LeadRow[];
  /** Server timestamp, so pages can mark overdue items without reading a clock during render. */
  asOf: string;
}> {
  const supabase = await getServerClient();
  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  ).toISOString();
  // "Stale" = came in more than two days ago and nobody has reached them.
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const [newLeads, followUpsDue, hotOpen, staleUncontacted] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .eq("status", "new")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(20),
    supabase
      .from("leads")
      .select("*")
      .not("next_follow_up_at", "is", null)
      .lt("next_follow_up_at", endOfToday)
      .order("next_follow_up_at", { ascending: true })
      .limit(20),
    supabase
      .from("leads")
      .select("*")
      .eq("temperature", "high")
      .not("status", "in", "(won,lost)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("leads")
      .select("*")
      .in("status", ["new", "attempted_contact"])
      .lt("created_at", twoDaysAgo)
      .order("created_at", { ascending: true })
      .limit(10),
  ]);

  const firstError =
    newLeads.error ?? followUpsDue.error ?? hotOpen.error ?? staleUncontacted.error;
  if (firstError) {
    logger.error("action_queues_failed", { message: firstError.message });
    throw new Error("Kunne ikke hente arbejdslisten");
  }

  return {
    newLeads: newLeads.data ?? [],
    followUpsDue: followUpsDue.data ?? [],
    hotOpen: hotOpen.data ?? [],
    staleUncontacted: staleUncontacted.data ?? [],
    asOf: now.toISOString(),
  };
}

/** Meetings scheduled for today, with the lead they belong to. */
export async function getTodaysMeetings(): Promise<
  (AppointmentRow & { lead: Pick<LeadRow, "id" | "first_name" | "last_name" | "phone"> | null })[]
> {
  const supabase = await getServerClient();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  ).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select("*, lead:leads(id, first_name, last_name, phone)")
    .eq("status", "scheduled")
    .gte("starts_at", start)
    .lt("starts_at", end)
    .order("starts_at", { ascending: true });

  if (error) {
    logger.error("todays_meetings_failed", { message: error.message });
    return [];
  }

  return (data ?? []) as unknown as (AppointmentRow & {
    lead: Pick<LeadRow, "id" | "first_name" | "last_name" | "phone"> | null;
  })[];
}

/** Lead counts per pipeline status, for the pipeline view. */
export async function getPipelineBreakdown(): Promise<Record<string, number>> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("leads").select("status");
  if (error) {
    logger.error("pipeline_breakdown_failed", { message: error.message });
    return {};
  }
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}
