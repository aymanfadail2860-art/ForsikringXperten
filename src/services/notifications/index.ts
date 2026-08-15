import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/observability/logger";

/**
 * Notification outbox.
 *
 * Nothing is sent yet — no email or SMS provider is configured, and sending
 * real messages from an unconfigured integration is worse than not sending at
 * all. Intents are queued in the `notifications` table instead, so that:
 *   - the advisor UI can show what would have been sent
 *   - turning delivery on later is a worker reading this table, not a rewrite
 *   - nothing is lost in the meantime
 */

export type NotificationChannel = "email" | "sms" | "internal";

export type NotificationTemplate =
  | "lead_confirmation"
  | "advisor_new_lead"
  | "appointment_confirmation"
  | "appointment_reminder"
  | "follow_up_reminder";

export async function queueNotification(input: {
  leadId: string | null;
  channel: NotificationChannel;
  template: NotificationTemplate;
  recipient?: string | null;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from("notifications").insert({
      lead_id: input.leadId,
      channel: input.channel,
      template: input.template,
      recipient: input.recipient ?? null,
      payload: input.payload ?? {},
      // 'pending' means "should be sent when a provider exists".
      status: "pending",
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    // A notification must never be the reason a lead submission fails.
    logger.warn("notification_queue_failed", {
      template: input.template,
      channel: input.channel,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
