/**
 * SMS boundary. Same contract as the email service — queue now, deliver when a
 * provider exists. SMS reminders for booked meetings are the first intended
 * use, which is why `notifications` already carries a `recipient` column.
 */

export type SmsMessage = {
  to: string;
  body: string;
};

export type SmsService = {
  readonly id: string;
  isConfigured(): boolean;
  send?(message: SmsMessage): Promise<{ id: string }>;
};

const notConfigured: SmsService = {
  id: "none",
  isConfigured: () => false,
};

export function getSmsService(): SmsService {
  return notConfigured;
}
