/**
 * Cookie consent state.
 *
 * Rules that must not be relaxed:
 *  - Nothing but strictly necessary storage runs before an explicit choice.
 *  - "No choice yet" is not consent.
 *  - The user can change the choice at any time (see /cookiepolitik).
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the decision — stored with the lead as proof of consent. */
  decidedAt: string;
  /** Version of the consent text the user accepted. */
  version: number;
};

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "fx_consent";

export const denyAll: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decidedAt: "",
  version: CONSENT_VERSION,
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null; // re-ask when the text changes
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function writeConsent(next: Omit<ConsentState, "necessary" | "version" | "decidedAt">) {
  const state: ConsentState = {
    necessary: true,
    analytics: next.analytics,
    marketing: next.marketing,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — treat the session as consent-less */
  }
  window.dispatchEvent(new CustomEvent<ConsentState>("fx:consent", { detail: state }));
  return state;
}

/** Google Consent Mode v2 signal map. */
export function toGoogleConsent(state: ConsentState) {
  return {
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  } as const;
}
