"use client";

import Link from "next/link";
import { segmentCta } from "@/config/cta";
import { Container, Section } from "@/components/ui/Layout";
import { trackCtaClick } from "@/lib/analytics/track";

/**
 * Privat / erhverv split.
 *
 * Each panel routes into the same funnel with the segment pre-selected, which
 * removes the first question for visitors who already know what they need.
 */

const segments = [
  {
    key: "privat" as const,
    label: "Privat",
    title: "Dine egne forsikringer",
    body: "Bil, bolig, indbo, ulykke og rejse. Ofte tegnet på forskellige tidspunkter og sjældent set efter i sammenhæng.",
    items: ["Bil", "Hus", "Indbo", "Ulykke", "Rejse", "Familie"],
    href: segmentCta.private.href,
    cta: segmentCta.private.label,
    overview: "/privat",
  },
  {
    key: "erhverv" as const,
    label: "Erhverv",
    title: "Virksomhedens forsikringer",
    body: "Ansvar, arbejdsskade, bygninger, biler, driftstab og cyber. Aftaler, der skal følge med, når virksomheden ændrer sig.",
    items: ["Ansvar", "Arbejdsskade", "Bygninger", "Biler", "Driftstab", "Cyber"],
    href: segmentCta.business.href,
    cta: segmentCta.business.label,
    overview: "/erhverv",
  },
];

export function SegmentSplit() {
  return (
    <Section tone="canvas">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          {segments.map((segment) => (
            <div
              key={segment.key}
              className={
                segment.key === "erhverv"
                  ? "flex flex-col rounded-2xl bg-navy p-7 on-dark sm:p-9"
                  : "flex flex-col rounded-2xl border border-ink-100 bg-surface p-7 sm:p-9"
              }
            >
              <p
                className={`text-caption font-semibold uppercase tracking-[0.12em] ${
                  segment.key === "erhverv" ? "text-highlight" : "text-accent-600"
                }`}
              >
                {segment.label}
              </p>
              <h2 className="mt-3 text-h2">{segment.title}</h2>
              <p
                className={`mt-3 text-body ${
                  segment.key === "erhverv" ? "text-ink-200" : "text-ink-600"
                }`}
              >
                {segment.body}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {segment.items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-md px-2.5 py-1 text-small font-medium ${
                      segment.key === "erhverv"
                        ? "bg-white/10 text-ink-100"
                        : "bg-ink-50 text-ink-700"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Link
                  href={segment.href}
                  onClick={() => trackCtaClick("segment_split", segment.cta, segment.href)}
                  className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-body font-semibold transition-colors ${
                    segment.key === "erhverv"
                      ? "bg-white text-navy hover:bg-ink-100"
                      : "bg-accent-600 text-white hover:bg-accent-700"
                  }`}
                >
                  {segment.cta}
                </Link>
                <Link
                  href={segment.overview}
                  className={`text-small font-semibold ${
                    segment.key === "erhverv"
                      ? "text-ink-200 hover:text-white"
                      : "text-accent-700 hover:text-accent-800"
                  }`}
                >
                  Se hvad vi kan hjælpe med →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
