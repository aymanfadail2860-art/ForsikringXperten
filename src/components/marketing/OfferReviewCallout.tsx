"use client";

import Link from "next/link";
import { offerReviewCta } from "@/config/cta";
import { trackCtaClick } from "@/lib/analytics/track";
import type { CtaLocation } from "@/lib/analytics/events";

/**
 * "You already have an offer" entry point.
 *
 * An ad promising a counter-offer sends people here holding a document and a
 * deadline. Without somewhere to say so, they land on a generic review flow
 * that does not sound like what they were promised — and leave.
 *
 * The promise is deliberately limited to what we can always do: read it and
 * tell them what it covers. No claim that we will beat it.
 */
export function OfferReviewCallout({
  location,
  audience = "erhverv",
}: {
  location: CtaLocation;
  audience?: "privat" | "erhverv";
}) {
  const body =
    audience === "erhverv"
      ? "Har I allerede fået et tilbud fra et selskab eller en mægler? Send det med, så gennemgår vi dækning, summer og selvrisiko — og fortæller jer, hvad der reelt står i det."
      : "Har du allerede fået et tilbud? Send det med, så gennemgår vi dækning og selvrisiko og fortæller dig, hvad der reelt står i det.";

  return (
    <div className="rounded-xl border border-ink-200 bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
      <div className="max-w-xl">
        <h2 className="text-h3">Har du et tilbud liggende?</h2>
        <p className="mt-2 text-body text-ink-600">{body}</p>
      </div>
      <Link
        href={offerReviewCta.href}
        onClick={() => trackCtaClick(location, offerReviewCta.shortLabel, offerReviewCta.href)}
        className="mt-5 inline-flex shrink-0 items-center justify-center rounded-lg bg-accent-600 px-5 py-3 text-body font-semibold text-white transition-colors hover:bg-accent-700 sm:mt-0"
      >
        {offerReviewCta.shortLabel}
      </Link>
    </div>
  );
}
