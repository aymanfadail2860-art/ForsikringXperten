"use client";

import type { AnalyticsEvent, AnalyticsPayload } from "./events";
import { readConsent } from "./consent";

/**
 * Single analytics entry point for the whole application.
 *
 * Components never talk to GTM, GA4 or Meta directly — they call trackEvent().
 * That keeps vendor code out of the UI and means swapping a tool is a change
 * in one file (see `src/services/analytics`).
 *
 * Events are always pushed to the dataLayer, which is only *read* by tags that
 * have been loaded — and tags load only after consent. Events fired before a
 * decision sit in the queue and are flushed if consent is later granted.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type QueuedEvent = { event: AnalyticsEvent; payload: AnalyticsPayload; ts: number };

const queue: QueuedEvent[] = [];
const MAX_QUEUE = 50;

function push(event: AnalyticsEvent, payload: AnalyticsPayload) {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
}

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const consent = readConsent();
  const clean: AnalyticsPayload = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null && v !== "") clean[k] = v;
  }

  if (!consent?.analytics) {
    // Hold rather than drop: a user who accepts after starting the funnel
    // should still produce a coherent funnel, but nothing is sent meanwhile.
    if (queue.length < MAX_QUEUE) queue.push({ event, payload: clean, ts: Date.now() });
    return;
  }

  flushQueue();
  push(event, clean);
}

/** Called after consent is granted. Exported for the consent banner. */
export function flushQueue() {
  if (typeof window === "undefined") return;
  const consent = readConsent();
  if (!consent?.analytics) return;
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    push(item.event, { ...item.payload, queued_ms_ago: Date.now() - item.ts });
  }
}

/** Convenience wrapper so CTA instrumentation stays consistent. */
export function trackCtaClick(location: string, label: string, href: string) {
  trackEvent("cta_click", { cta_location: location, cta_label: label, cta_href: href });
}
