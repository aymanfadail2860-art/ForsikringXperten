"use client";

import Link from "next/link";
import { segmentCta, offerReviewCta } from "@/config/cta";
import { trackCtaClick } from "@/lib/analytics/track";

/**
 * The first step of the forsikringstjek, on the front page.
 *
 * The funnel's opening question is two choices. Making the visitor load a
 * separate page to answer it was pure friction, so the question is asked
 * here instead and the answer is carried into the funnel as a query
 * parameter.
 *
 * This is deliberately NOT a second form: there is one funnel, one schema and
 * one set of events. These are links that pre-answer step one, so nothing is
 * duplicated and nothing can drift out of sync.
 */

const options = [
  {
    key: "privat" as const,
    title: "Mine private forsikringer",
    description: "Bil, bolig, indbo, ulykke og rejse",
    href: segmentCta.private.href,
    label: segmentCta.private.label,
  },
  {
    key: "erhverv" as const,
    title: "Min virksomheds forsikringer",
    description: "Ansvar, arbejdsskade, biler, bygninger og mere",
    href: segmentCta.business.href,
    label: segmentCta.business.label,
  },
];

export function HeroStarter() {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-lg backdrop-blur-sm">
      <div className="rounded-xl bg-surface p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-400">
            Trin 1 af 5
          </p>
          <span className="text-caption text-ink-400">ca. 2 min</span>
        </div>
        {/* Matches the funnel's own first question word for word, so the
            transition into the flow reads as a continuation, not a restart. */}
        <h2 className="mt-3 text-h3 text-ink-900">Hvad vil du have gennemgået?</h2>

        <div className="mt-4 space-y-2.5">
          {options.map((option) => (
            <Link
              key={option.key}
              href={option.href}
              onClick={() => trackCtaClick("hero_starter", option.label, option.href)}
              className="group flex items-center gap-3 rounded-lg border border-ink-200 bg-surface p-4 transition-colors hover:border-accent-400 hover:bg-accent-50"
            >
              <span
                aria-hidden="true"
                className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink-300 transition-colors group-hover:border-accent-600"
              >
                <span className="size-2 rounded-full bg-transparent transition-colors group-hover:bg-accent-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body font-semibold text-ink-900">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-small text-ink-500">
                  {option.description}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-ink-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-600"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Third intent: they already hold an offer and want a second opinion.
            Quieter than the two main paths because it is a smaller audience,
            but it is the exact promise a counter-offer ad makes. */}
        <Link
          href={offerReviewCta.href}
          onClick={() =>
            trackCtaClick("hero_starter", offerReviewCta.label, offerReviewCta.href)
          }
          className="mt-3 flex items-center gap-2 rounded-lg px-1 py-2 text-small font-semibold text-accent-700 hover:underline"
        >
          {offerReviewCta.label}
          <span aria-hidden="true">→</span>
        </Link>

        <p className="mt-3 border-t border-ink-100 pt-3 text-small text-ink-500">
          Ingen CPR-nummer, helbredsoplysninger eller betalingsoplysninger.
        </p>
      </div>
    </div>
  );
}
