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

/** Short reassurance rendered next to the primary CTA. */
export const ctaTrustLine = reviewIsDocumentedFree
  ? "Uforpligtende gennemgang · Tager ca. 2 minutter at starte"
  : "Uforpligtende gennemgang · Tager ca. 2 minutter at starte";

/** Segment-specific entry points into the same funnel. */
export const segmentCta = {
  private: { label: "Tjek mine private forsikringer", href: `${LEAD_FLOW_PATH}?type=privat` },
  business: {
    label: "Tjek virksomhedens forsikringer",
    href: `${LEAD_FLOW_PATH}?type=erhverv`,
  },
} as const;
