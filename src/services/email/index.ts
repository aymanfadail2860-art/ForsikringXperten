/**
 * Transactional email boundary.
 *
 * No provider is configured, so `isConfigured()` is false and the application
 * queues intents in `notifications` instead of sending. Implement this
 * interface (Resend, Postmark, SendGrid — the app does not care) and point
 * a worker at the pending rows.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export type EmailService = {
  readonly id: string;
  isConfigured(): boolean;
  send?(message: EmailMessage): Promise<{ id: string }>;
};

const notConfigured: EmailService = {
  id: "none",
  isConfigured: () => false,
};

export function getEmailService(): EmailService {
  return notConfigured;
}
