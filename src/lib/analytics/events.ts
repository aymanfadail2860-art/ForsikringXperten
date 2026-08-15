/**
 * The full conversion event vocabulary.
 *
 * Every measurable action on the site funnels through this list. Keeping it
 * closed (rather than free-form strings) is what makes
 * "ad → page → behaviour → lead → sale" answerable later.
 */
export const analyticsEvents = [
  "page_view",
  "cta_click",
  "lead_flow_started",
  "lead_step_viewed",
  "lead_step_completed",
  "lead_submitted",
  "lead_submit_failed",
  "booking_started",
  "booking_completed",
  "phone_click",
  "email_click",
  "faq_opened",
  "case_viewed",
  "guide_viewed",
  "consent_updated",
] as const;

export type AnalyticsEvent = (typeof analyticsEvents)[number];

/** Loose payload: values must stay primitive so any tag manager can read them. */
export type AnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined | string[]
>;

/** Where a CTA click happened — lets us compare placements, not just totals. */
export type CtaLocation =
  | "header"
  | "hero"
  | "sticky_mobile"
  | "segment_split"
  | "process"
  | "product_page"
  | "industry_page"
  | "guide"
  | "landing_page"
  | "footer_cta"
  | "faq"
  | "contact";
