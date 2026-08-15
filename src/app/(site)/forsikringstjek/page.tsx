import type { Metadata } from "next";
import Link from "next/link";
import { LeadFunnel } from "@/components/funnel/LeadFunnel";
import { Container } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { LEAD_TYPES, type LeadType } from "@/lib/validation/lead";

export const metadata: Metadata = buildMetadata({
  title: "Forsikringstjek",
  description:
    "Fortæl kort om din situation, så vender en rådgiver tilbage med en gennemgang af dine forsikringer. Tager to til tre minutter.",
  path: "/forsikringstjek",
  // The funnel has no informational value in search results, and indexing it
  // splits ranking signals away from the pages that should rank.
  noIndex: true,
});

const reassurance = [
  "Vi beder ikke om CPR-nummer, helbredsoplysninger eller betalingsoplysninger.",
  "Du forpligter dig ikke til at skifte noget.",
  "Du kan altid få slettet dine oplysninger igen.",
];

export default async function ForsikringstjekPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const initialType = LEAD_TYPES.includes(params.type as LeadType)
    ? (params.type as LeadType)
    : undefined;

  return (
    <div className="bg-canvas">
      <Container width="content" className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
              Forsikringstjek
            </p>
            <h1 className="mt-3 text-h1">Lad os få overblik over dine forsikringer</h1>
            <p className="mt-4 max-w-xl text-body-lg text-ink-600">
              Et par korte spørgsmål om din situation. Så ved rådgiveren, hvad samtalen
              skal handle om, inden I taler sammen.
            </p>

            <div className="mt-9 rounded-xl border border-ink-100 bg-surface p-6 shadow-sm sm:p-8">
              <LeadFunnel initialType={initialType} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-ink-100 bg-surface p-5">
              <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                Godt at vide
              </h2>
              <ul className="mt-4 space-y-3">
                {reassurance.map((item) => (
                  <li key={item} className="flex gap-2.5 text-small text-ink-600">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-success-500"
                    >
                      <path
                        d="m3.5 8.3 3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-ink-100 pt-4 text-small text-ink-500">
                Læs hvordan vi behandler dine oplysninger i{" "}
                <Link
                  href="/privatlivspolitik"
                  className="font-medium text-accent-700 underline"
                >
                  privatlivspolitikken
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
