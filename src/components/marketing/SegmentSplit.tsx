"use client";

import Link from "next/link";
import { segmentCta } from "@/config/cta";
import { Container, Section } from "@/components/ui/Layout";
import { trackCtaClick } from "@/lib/analytics/track";

/**
 * Privat / erhverv.
 *
 * This section used to be a pair of near-identical cards listing product
 * names, followed much later by a separate "when is it relevant" section of
 * bullet lists. Both have been folded together here: each panel now answers
 * "is this me?" with changes a person actually recognises from their own
 * year, and then offers the one tap that matches.
 *
 * The two panels are deliberately not symmetrical. Private is a light card,
 * business is dark and bordered — a visitor scanning on a phone should be
 * able to tell them apart before reading a word.
 */

const segments = [
  {
    key: "privat" as const,
    label: "Privat",
    title: "Dine egne forsikringer",
    triggers: [
      "Ny bil — eller en ung bilist på policen",
      "Flyttet, bygget om eller købt bolig med en overtaget aftale",
      "Indbosummen er den samme som for fem år siden",
      "Rejsedækning både på forsikringen og på kreditkortet",
    ],
    areas: ["Bil", "Hus", "Indbo", "Ulykke", "Rejse", "Sundhed"],
    href: segmentCta.private.href,
    cta: segmentCta.private.label,
    overview: "/privat",
  },
  {
    key: "erhverv" as const,
    label: "Erhverv",
    title: "Virksomhedens forsikringer",
    triggers: [
      "Flere ansatte, eller lønsummen har ændret sig",
      "Nye maskiner, biler eller dyrere værktøj i bilerne",
      "Nye opgavetyper — eller en bygherre stiller krav til summen",
      "Aftaler tegnet på hver sin tid, hos hver sit selskab",
    ],
    areas: ["Ansvar", "Arbejdsskade", "Bygninger", "Biler", "Driftstab", "Cyber"],
    href: segmentCta.business.href,
    cta: segmentCta.business.label,
    overview: "/erhverv",
  },
];

export function SegmentSplit() {
  return (
    <Section tone="navy">
      <Container>
        <div className="max-w-2xl">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-highlight">
            Hvem er du
          </p>
          <h2 className="mt-3 text-h2 text-white sm:text-[2.25rem] sm:leading-[2.6rem]">
            Genkender du et af punkterne her, er aftalen værd at se efter
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {segments.map((segment) => {
            const light = segment.key === "privat";
            return (
              <div
                key={segment.key}
                className={
                  light
                    ? "flex flex-col rounded-2xl bg-surface p-6 sm:p-8"
                    : "flex flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8"
                }
              >
                <p
                  className={`text-caption font-semibold uppercase tracking-[0.12em] ${
                    light ? "text-accent-700" : "text-highlight"
                  }`}
                >
                  {segment.label}
                </p>
                <h3
                  className={`mt-2.5 text-h3 ${light ? "text-ink-900" : "text-white"}`}
                >
                  {segment.title}
                </h3>

                <ul
                  className={`mt-5 space-y-0 divide-y ${
                    light ? "divide-ink-100 border-t border-ink-100" : "divide-white/10 border-t border-white/10"
                  }`}
                >
                  {segment.triggers.map((trigger) => (
                    <li
                      key={trigger}
                      className={`flex gap-3 py-3 text-body ${
                        light ? "text-ink-700" : "text-ink-200"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2.5 size-1.5 shrink-0 rounded-full ${
                          light ? "bg-accent-500" : "bg-highlight"
                        }`}
                      />
                      {trigger}
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {segment.areas.map((area) => (
                    <li
                      key={area}
                      className={`rounded-md px-2 py-1 text-small ${
                        light ? "bg-ink-50 text-ink-600" : "bg-white/10 text-ink-200"
                      }`}
                    >
                      {area}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                  <Link
                    href={segment.href}
                    onClick={() => trackCtaClick("segment_split", segment.cta, segment.href)}
                    className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-5 py-3 text-body font-semibold text-white transition-colors hover:bg-accent-700 active:scale-[0.99]"
                  >
                    {segment.cta}
                  </Link>
                  <Link
                    href={segment.overview}
                    className={`text-small font-semibold ${
                      light ? "text-accent-700 hover:underline" : "text-ink-200 hover:text-white"
                    }`}
                  >
                    Se områderne →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
