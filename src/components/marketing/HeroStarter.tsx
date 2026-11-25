"use client";

import Link, { useLinkStatus } from "next/link";
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
 *
 * Feedback on tap is handled in three layers, because measurement showed the
 * screen sat completely unchanged for ~950ms after a tap on a throttled phone:
 *   0ms    `active:` styles — the press itself
 *   ~0ms   `useLinkStatus().pending` — the choice fills in, like a radio would
 *   ~50ms  the route's `loading.tsx` shell takes over
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

/**
 * Rendered inside <Link> so it can read that link's navigation state.
 *
 * The interaction model is borrowed from a Radix/shadcn RadioGroup — the
 * choice registers visually the instant it is made — but it is wired to real
 * navigation state rather than to local state, so the indicator cannot get out
 * of step with what the browser is actually doing. No Radix dependency.
 */
function OptionBody({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      <span
        aria-hidden="true"
        className={`relative grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          pending
            ? "border-accent-600"
            : "border-ink-300 group-hover:border-accent-600"
        }`}
      >
        <span
          className={`size-2 rounded-full transition-colors ${
            pending ? "bg-accent-600" : "bg-transparent group-hover:bg-accent-600"
          }`}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-body font-semibold text-ink-900">{title}</span>
        <span className="mt-0.5 block text-small text-ink-500">{description}</span>
      </span>

      {pending ? (
        <>
          <svg
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin text-accent-600"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
            <path
              d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {/* Announced once, for anyone who cannot see the spinner. */}
          <span role="status" className="sr-only">
            Åbner forsikringstjekket
          </span>
        </>
      ) : (
        <span
          aria-hidden="true"
          className="shrink-0 text-ink-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-600"
        >
          →
        </span>
      )}
    </>
  );
}

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
              className="group flex items-center gap-3 rounded-lg border border-ink-200 bg-surface p-4 transition-[color,background-color,border-color,transform] duration-150 hover:border-accent-400 hover:bg-accent-50 active:scale-[0.99] active:bg-accent-50 has-[:focus-visible]:border-accent-500"
            >
              <OptionBody title={option.title} description={option.description} />
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
          className="mt-3 flex items-center gap-2 rounded-lg px-1 py-2 text-small font-semibold text-accent-700 transition-opacity hover:underline active:opacity-70"
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
