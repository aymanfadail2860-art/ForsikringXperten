import { reviewIsDocumentedFree, siteConfig, phoneIsPublic } from "./site";

/**
 * Global CTA hierarchy. Wording is defined once so the same promise appears
 * everywhere — inconsistent CTA copy is the fastest way to lose a conversion
 * flow's measurability.
 */

export const LEAD_FLOW_PATH = "/forsikringstjek";
export const BOOKING_PATH = "/book";

/**
 * "Gratis" is a price claim. Until it is documented in siteConfig we describe
 * the process instead ("uforpligtende"), which is true regardless.
 */
export const primaryCta = {
  label: reviewIsDocumentedFree
    ? "Få et gratis forsikringstjek"
    : "Få et forsikringstjek",
  shortLabel: "Start forsikringstjek",
  href: LEAD_FLOW_PATH,
} as const;

export const secondaryCta = {
  label: "Book en samtale",
  href: BOOKING_PATH,
} as const;

export const tertiaryCta = phoneIsPublic
  ? ({
      label: "Ring til os",
      href: `tel:${siteConfig.contact.phoneHref.value}`,
    } as const)
  : null;

/**
 * Short reassurance rendered next to the primary CTA.
 * Both halves are true regardless of pricing, so this does not branch on
 * `reviewIsDocumentedFree` — the price claim lives in the CTA label only.
 */
export const ctaTrustLine =
  "Uforpligtende gennemgang · Tager ca. 2 minutter at starte";

/**
 * Segment-specific entry points into the same funnel.
 *
 * The wording mirrors the promise the ads make, so the button a visitor lands
 * on says the thing they clicked for. "Modbud" describes what we produce —
 * an alternative offer held up against the one they have — not a promise that
 * it will be cheaper.
 *
 * Note for analytics: these labels are the `cta_label` dimension, so the
 * values change from this release. Comparisons across the change should be
 * made on `cta_location`, which is stable.
 */
export const segmentCta = {
  private: {
    label: "Sammenlign mine forsikringer",
    href: `${LEAD_FLOW_PATH}?type=privat`,
  },
  business: {
    label: "Få et modbud til mit firma",
    href: `${LEAD_FLOW_PATH}?type=erhverv`,
  },
} as const;

/**
 * Third entry point: the visitor already holds an offer — from their current
 * insurer or a competitor — and wants a second opinion on it.
 *
 * This is a real and very common intent (it is what a "modbud" ad promises),
 * and it converts better than a generic review because the visitor already
 * has the document in hand. It runs through the same funnel; only the framing
 * differs.
 */
export const offerReviewCta = {
  label: "Jeg har fået et tilbud, jeg vil have set efter",
  shortLabel: "Få et tilbud vurderet",
  href: `${LEAD_FLOW_PATH}?intent=tilbud`,
} as const;
