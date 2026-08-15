/**
 * Central site configuration.
 *
 * ⚠️ PLACEHOLDER POLICY
 * Everything marked `verified: false` is NOT confirmed business information.
 * Nothing unverified is rendered on the public site — see `publicCompanyFacts()`
 * and the `<VerifiedOnly>` guard. Fill in the real values, flip `verified` to
 * true, and the information appears automatically.
 *
 * Never invent: CVR, address, phone, certifications, partnerships, ratings,
 * customer counts or review scores. Insurance is a regulated industry and
 * undocumented claims are a legal risk, not a copy problem.
 */

export type VerifiableValue<T> = {
  value: T;
  /** Set to true only when the value is documented and legally safe to publish. */
  verified: boolean;
  /** Internal note explaining what is missing. Never rendered publicly. */
  note?: string;
};

const unverified = <T,>(value: T, note: string): VerifiableValue<T> => ({
  value,
  verified: false,
  note,
});

const verified = <T,>(value: T): VerifiableValue<T> => ({ value, verified: true });

export const siteConfig = {
  siteName: "Forsikringxperten",
  /** Used in <title> templates and structured data. */
  legalName: unverified(
    "Forsikringxperten",
    "Registreret selskabsnavn mangler — udfyld med navnet fra CVR-registret.",
  ),
  domain: "forsikringxperten.dk",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://forsikringxperten.dk",
  locale: "da_DK",
  language: "da",

  description:
    "Få gennemgået dine forsikringer af en rådgiver, og se om pris, dækning og løsning stadig passer til din situation.",

  contact: {
    phone: unverified(
      "+45 00 00 00 00",
      "Telefonnummer mangler. Indtil det er udfyldt, skjules alle ring-op CTA'er.",
    ),
    /** E.164 format for tel: links. */
    phoneHref: unverified("+4500000000", "Følger telefonnummeret."),
    email: unverified(
      "kontakt@forsikringxperten.dk",
      "Bekræft at postkassen findes og overvåges, før den vises offentligt.",
    ),
    openingHours: unverified(
      "Man–tors 9–16, fre 9–15",
      "Bekræft faktiske åbningstider.",
    ),
  },

  company: {
    cvr: unverified("00000000", "CVR-nummer mangler."),
    addressLine: unverified("Gadenavn 1", "Adresse mangler."),
    postalCode: unverified("0000", "Postnummer mangler."),
    city: unverified("By", "By mangler."),
    country: verified("Danmark"),
  },

  social: {
    linkedin: unverified("", "LinkedIn-profil mangler."),
  },

  /**
   * How the business actually operates. This drives the compliance-sensitive
   * copy on the site. Getting this wrong creates a misleading impression of
   * market coverage — read `docs/COMPLIANCE.md` before changing it.
   */
  businessModel: {
    /**
     * "unknown" until documented. Determines whether we may describe the
     * service as covering several providers at all.
     *
     * - "single-provider"  : tied to one insurance company
     * - "multi-provider"   : works with a defined, listed set of companies
     * - "independent"      : legally independent advice (kræver dokumentation)
     * - "unknown"          : no market-coverage claims are rendered
     */
    providerRelationship: "unknown" as
      | "single-provider"
      | "multi-provider"
      | "independent"
      | "unknown",
    /** Names of providers we may publicly say we work with. Empty = say nothing. */
    namedProviders: [] as string[],
    /** Is the insurance review actually free for the customer? */
    reviewIsFree: unverified(
      true,
      "Bekræft at gennemgangen er gratis og uforpligtende, før ordet 'gratis' bruges i CTA'er.",
    ),
    /** Set true only if a registration (fx Finanstilsynet) is documented. */
    registrations: [] as { label: string; register: string; number: string }[],
  },

  /**
   * Real social proof only. Leave at zero/empty until documented numbers exist.
   * Nothing here is rendered while `verified` is false.
   */
  socialProof: {
    reviewScore: unverified(
      null as number | null,
      "Ingen dokumenteret anmeldelsesscore. Må ikke vises.",
    ),
    reviewCount: unverified(
      null as number | null,
      "Ingen dokumenteret antal anmeldelser. Må ikke vises.",
    ),
    customerCount: unverified(
      null as number | null,
      "Ingen dokumenteret kundetal. Må ikke vises.",
    ),
  },

  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    linkedInPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
  },

  booking: {
    /**
     * External booking URL (fx Calendly) used until a native calendar
     * integration is configured. See `src/services/calendar`.
     */
    externalUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Returns the value only if it has been verified — otherwise null. */
export function publicValue<T>(v: VerifiableValue<T>): T | null {
  return v.verified ? v.value : null;
}

/** True when a phone number is confirmed and "Ring til os" CTAs may render. */
export const phoneIsPublic = siteConfig.contact.phone.verified;
export const emailIsPublic = siteConfig.contact.email.verified;

/**
 * The word "gratis" may only appear in CTA copy when it is documented.
 * Falls back to "uforpligtende", which describes the process, not the price.
 */
export const reviewIsDocumentedFree = siteConfig.businessModel.reviewIsFree.verified;

/**
 * Full postal address, or null when incomplete. Used for structured data and
 * the footer — a half-filled address is worse than none.
 */
export function publicAddress() {
  const { addressLine, postalCode, city, country } = siteConfig.company;
  if (!addressLine.verified || !postalCode.verified || !city.verified) return null;
  return {
    streetAddress: addressLine.value,
    postalCode: postalCode.value,
    addressLocality: city.value,
    addressCountry: country.value,
  };
}
