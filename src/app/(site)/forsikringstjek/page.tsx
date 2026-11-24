import type { Metadata } from "next";
import Link from "next/link";
import { LeadFunnel } from "@/components/funnel/LeadFunnel";
import { Container } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { LEAD_TYPES, type LeadType } from "@/lib/validation/lead";
import { publicResponseTime, handlesSwitching } from "@/config/site";

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

/** Entry framings. The questions are identical; only the context differs. */
const framings = {
  default: {
    title: "Lad os få overblik over dine forsikringer",
    intro:
      "Et par korte spørgsmål om din situation. Så ved rådgiveren, hvad samtalen skal handle om, inden I taler sammen.",
  },
  tilbud: {
    title: "Få tilbuddet set efter, inden du skriver under",
    intro:
      "Vi spørger først om din situation, så rådgiveren ved, hvad tilbuddet skal holdes op imod — dækning, selvrisiko og de ting, der ikke står med store bogstaver.",
  },
} as const;

export default async function ForsikringstjekPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; intent?: string }>;
}) {
  const params = await searchParams;
  const initialType = LEAD_TYPES.includes(params.type as LeadType)
    ? (params.type as LeadType)
    : undefined;
  const intent = params.intent === "tilbud" ? "tilbud" : undefined;
  const framing = intent ? framings.tilbud : framings.default;

  return (
    <div className="bg-canvas">
      <Container width="content" className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
              Forsikringstjek
            </p>
            <h1 className="mt-3 text-h1">{framing.title}</h1>
            <p className="mt-4 max-w-xl text-body-lg text-ink-600">{framing.intro}</p>

            <div className="mt-9 rounded-xl border border-ink-100 bg-surface p-6 shadow-sm sm:p-8">
              <LeadFunnel initialType={initialType} intent={intent} />
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {/*
              What happens after submitting, shown BEFORE submitting.
              Uncertainty about the next step is what stops people halfway,
              and by the time they reach the confirmation screen it is too
              late for the answer to matter.
            */}
            <div className="rounded-xl border border-ink-100 bg-surface p-5">
              <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                Når du har sendt
              </h2>
              <ol className="mt-4 space-y-3">
                {[
                  "En rådgiver læser det, du har sendt, og forbereder sig",
                  publicResponseTime
                    ? `Vi kontakter dig ${publicResponseTime}`
                    : "Vi kontakter dig på den måde, du har valgt",
                  "Du får en gennemgang — og beslutter selv resten",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-100 text-caption font-bold text-ink-700"
                    >
                      {i + 1}
                    </span>
                    <span className="text-small text-ink-700">{step}</span>
                  </li>
                ))}
              </ol>
              {handlesSwitching ? (
                <p className="mt-4 border-t border-ink-100 pt-3 text-small text-ink-500">
                  Vælger du at flytte en forsikring, klarer vi opsigelsen for dig.
                </p>
              ) : null}
            </div>

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
