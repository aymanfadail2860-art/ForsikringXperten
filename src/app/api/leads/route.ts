import { NextResponse } from "next/server";
import { leadSchema, fieldErrors } from "@/lib/validation/lead";
import { createLead } from "@/services/crm/leadRepository";
import { queueNotification } from "@/services/notifications";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { rateLimit, getClientIp, truncateIp } from "@/lib/security/rateLimit";
import { logger, describeError } from "@/lib/observability/logger";
import { siteConfig, publicValue } from "@/config/site";

/**
 * Public lead intake.
 *
 * This is the only way lead data enters the database. The browser never holds a
 * key that can write to Supabase — the service role lives here, behind
 * rate limiting, a bot trap and full server-side validation.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  const limit = rateLimit({ key: `lead:${ip}`, ...RATE_LIMIT });
  if (!limit.allowed) {
    logger.warn("lead_rate_limited", { retry_after: limit.retryAfter });
    return NextResponse.json(
      { ok: false, error: "For mange forsøg. Prøv igen om lidt." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ugyldig forespørgsel" },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    logger.warn("lead_validation_failed", { fields: Object.keys(errors) });
    return NextResponse.json(
      { ok: false, error: "Nogle felter mangler eller er forkerte", fields: errors },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Bot trap: a filled honeypot gets a success response so the script has no
  // signal to adapt to, but nothing is stored.
  if (lead.website) {
    logger.warn("lead_honeypot_triggered", {});
    return NextResponse.json({ ok: true, leadId: null });
  }

  if (!isSupabaseAdminConfigured()) {
    // Losing a real enquiry silently is unacceptable — log it loudly enough
    // that it can be recovered from the logs, and tell the user honestly.
    logger.error("lead_submit_no_database", {
      lead_type: lead.leadType,
      product_count: lead.selectedProducts.length,
    });
    const phone = publicValue(siteConfig.contact.phone);
    return NextResponse.json(
      {
        ok: false,
        error: phone
          ? `Vi kunne ikke gemme din henvendelse lige nu. Ring til os på ${phone}, så tager vi den med det samme.`
          : "Vi kunne ikke gemme din henvendelse lige nu. Prøv igen om lidt.",
      },
      { status: 503 },
    );
  }

  try {
    const result = await createLead({
      lead,
      ipPrefix: truncateIp(ip),
      userAgent: request.headers.get("user-agent"),
      source: lead.attribution?.utm_source ? "paid" : "direct",
    });

    // Queued, not sent — see services/notifications.
    await queueNotification({
      leadId: result.leadId,
      channel: "internal",
      template: "advisor_new_lead",
      payload: { score: result.score, temperature: result.temperature },
    });
    await queueNotification({
      leadId: result.leadId,
      channel: "email",
      template: "lead_confirmation",
      recipient: lead.email,
    });

    return NextResponse.json({
      ok: true,
      leadId: result.leadId,
      // The score is internal — never returned to the browser.
    });
  } catch (error) {
    const described = describeError(error);
    logger.error("lead_submit_failed", {
      message: described.message,
      lead_type: lead.leadType,
    });
    // No stack traces or database messages leak to the client.
    return NextResponse.json(
      { ok: false, error: "Noget gik galt hos os. Prøv igen om lidt." },
      { status: 500 },
    );
  }
}
