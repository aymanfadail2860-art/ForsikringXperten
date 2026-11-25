"use client";

import Link, { useLinkStatus } from "next/link";
import { segmentCta, offerReviewCta } from "@/config/cta";
import { trackCtaClick } from "@/lib/analytics/track";

/**
 * The first step of the forsikringstjek, on the front page.
 *
 * Renders without card chrome: the hero wraps it together with the policy
 * excerpt so the evidence and the action read as one object — here is what we
 * find in a policy, now let us look at yours.
 *
 * These are links that pre-answer step one, not a second form. One funnel,
 * one schema, one set of events.
 *
 * Feedback on tap is layered, because the screen used to sit unchanged for
 * ~950ms after a tap on a throttled phone:
 *   0ms    `active:` styles — the press itself
 *   ~0ms   `useLinkStatus().pending` — the choice fills in, like a radio
 *   ~150ms the route's `loading.tsx` shell takes over
 */

const options = [
  {
    key: "privat" as const,
    title: segmentCta.private.label,
    description: "Bil, bolig, indbo, ulykke og rejse",
    href: segmentCta.private.href,
    label: segmentCta.private.label,
  },
  {
    key: "erhverv" as const,
    title: segmentCta.business.label,
    description: "Ansvar, arbejdsskade, biler og bygninger",
    href: segmentCta.business.href,
    label: segmentCta.business.label,
  },
];

/**
 * Inside <Link>, so it can read that link's real navigation state. The
 * interaction model is a Radix/shadcn RadioGroup's — the choice registers the
 * instant it is made — wired to navigation rather than local state, without
 * the dependency.
 */
function OptionBody({ title, description }: { title: string; description: string }) {
  const { pending } = useLinkStatus();

  return (
    <>
      <span
        aria-hidden="true"
        className={`grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          pending ? "border-accent-600" : "border-ink-300 group-hover:border-accent-600"
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
            <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
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
    <div>
      <div className="flex items-baseline justify-between gap-4">
        {/* Same wording as the funnel's own first step, so crossing into the
            flow reads as a continuation rather than a restart. */}
        <h2 className="text-h3 text-ink-900">Hvad vil du have gennemgået?</h2>
        <span className="shrink-0 text-caption text-ink-400">Trin 1 af 5</span>
      </div>

      <div className="mt-3 space-y-2">
        {options.map((option) => (
          <Link
            key={option.key}
            href={option.href}
            onClick={() => trackCtaClick("hero_starter", option.label, option.href)}
            className="group flex items-center gap-3 rounded-lg border border-ink-200 bg-surface p-3 transition-[color,background-color,border-color,transform] duration-150 hover:border-accent-400 hover:bg-accent-50 active:scale-[0.99] active:bg-accent-50 has-[:focus-visible]:border-accent-500"
          >
            <OptionBody title={option.title} description={option.description} />
          </Link>
        ))}
      </div>

      {/* The counter-offer intent: they already hold a document and want a
          second opinion on it. Quieter, because it is a smaller audience. */}
      <Link
        href={offerReviewCta.href}
        onClick={() => trackCtaClick("hero_starter", offerReviewCta.label, offerReviewCta.href)}
        className="mt-3 flex items-center gap-2 text-small font-semibold text-accent-700 transition-opacity hover:underline active:opacity-70"
      >
        {offerReviewCta.label}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
