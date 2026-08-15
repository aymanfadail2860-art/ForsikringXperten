"use client";

/**
 * First-touch attribution.
 *
 * The first landing page, referrer and campaign parameters a visitor arrives
 * with are stored once and never overwritten — that is what lets us answer
 * "which ad produced this lead" weeks later.
 *
 * Last-touch is deliberately captured separately (and cheaply) so it can be
 * added to reporting later without changing the first-touch record.
 */

export const ATTRIBUTION_KEY = "fx_attribution";
const LAST_TOUCH_KEY = "fx_attribution_last";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  landing_page?: string;
  referrer?: string;
  first_seen_at?: string;
};

const PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

function readParams(search: string): Attribution {
  const params = new URLSearchParams(search);
  const out: Attribution = {};
  for (const key of PARAM_KEYS) {
    const value = params.get(key);
    // Cap length: these end up in the database and in logs.
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

function safeRead(key: string): Attribution | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: Attribution) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked — attribution degrades to "none", never breaks the form */
  }
}

/**
 * Records first touch if absent, and always refreshes last touch.
 * Safe to call on every navigation.
 */
export function captureAttribution(pathname: string, search: string) {
  if (typeof window === "undefined") return;

  const params = readParams(search);
  const referrer =
    document.referrer && !document.referrer.includes(window.location.host)
      ? document.referrer.slice(0, 300)
      : undefined;

  const existing = safeRead(ATTRIBUTION_KEY);

  if (!existing?.first_seen_at) {
    safeWrite(ATTRIBUTION_KEY, {
      ...params,
      landing_page: pathname,
      referrer,
      first_seen_at: new Date().toISOString(),
    });
  }

  // Last touch is only meaningful when a new campaign or external referrer appears.
  if (Object.keys(params).length > 0 || referrer) {
    safeWrite(LAST_TOUCH_KEY, {
      ...params,
      landing_page: pathname,
      referrer,
      first_seen_at: new Date().toISOString(),
    });
  }
}

/** First-touch attribution submitted alongside a lead. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return safeRead(ATTRIBUTION_KEY) ?? {};
}

export function getLastTouchAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return safeRead(LAST_TOUCH_KEY) ?? {};
}
