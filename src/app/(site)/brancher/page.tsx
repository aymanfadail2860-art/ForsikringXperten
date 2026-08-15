import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { LinkCard } from "@/components/ui/Card";
import { CtaBand } from "@/components/marketing/CtaBand";
import { industries } from "@/content/industries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Forsikring efter branche",
  description:
    "Hvilke forsikringsområder er typisk i spil i din branche? Se de risici og dækninger, der oftest er relevante — fra håndværk og transport til butik og kontor.",
  path: "/brancher",
});

export default function IndustriesPage() {
  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Brancher", path: "/brancher" },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">Forsikring efter branche</h1>
            <p className="mt-4 text-body-lg text-ink-600">
              Risikoen ser forskellig ud, alt efter hvad virksomheden laver. Her er de
              områder, der typisk er i spil — og de ændringer, der plejer at betyde, at
              aftalen skal ses efter.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container>
          <SectionHeading eyebrow="Vælg branche" title="Find din branche" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <li key={industry.slug} className="contents">
                <LinkCard
                  href={`/brancher/${industry.slug}`}
                  title={industry.name}
                  description={industry.summary}
                />
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-small text-ink-500">
            Er din branche ikke på listen? Vi gennemgår også virksomheder uden for de
            typer, der er beskrevet her — beskrivelserne er eksempler, ikke en afgrænsning.
          </p>
        </Container>
      </Section>

      <CtaBand
        title="Skal vi kigge på virksomhedens forsikringer?"
        location="industry_page"
      />
    </>
  );
}
