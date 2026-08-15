import { NextResponse } from "next/server";
import { funnelEventSchema } from "@/lib/validation/lead";
import { recordFunnelEvent } from "@/services/crm/leadRepository";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";
import { logger } from "@/lib/observability/logger";

/**
 * Funnel progression.
 *
 * Records where people get to in the forsikringstjek — including the steps
 * where they stop. Carries only an anonymous session id and a step, never
 * personal data, so drop-off is measurable without storing half-finished
 * people as leads (progressive profiling, §26).
 *
 * Always answers 204: a tracking failure must never surface to the visitor.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noContent = () => new NextResponse(null, { status: 204 });

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit({ key: `funnel:${ip}`, limit: 60, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) return noContent();

  if (!isSupabaseAdminConfigured()) return noContent();

  try {
    const parsed = funnelEventSchema.safeParse(await request.json());
    if (!parsed.success) return noContent();

    await recordFunnelEvent({
      sessionId: parsed.data.sessionId,
      eventType: parsed.data.eventType,
      stepId: parsed.data.stepId,
      stepIndex: parsed.data.stepIndex,
      leadType: parsed.data.leadType,
      landingPage: parsed.data.landingPage,
    });
  } catch (error) {
    logger.warn("funnel_event_route_failed", {
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return noContent();
}
