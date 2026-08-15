import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/Layout";
import { LinkCard } from "@/components/ui/Card";
import { CtaBand } from "@/components/marketing/CtaBand";
import { publishedCases } from "@/content/cases";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cases",
  description:
    "Konkrete forløb fra kunder, vi har gennemgået forsikringer for — offentliggjort med kundens accept.",
  path: "/cases",
  // Nothing to index until real cases exist.
  noIndex: publishedCases.length === 0,
});

/**
 * Cases.
 *
 * Renders an honest empty state rather than invented customer stories. The
 * component is finished — publishing a real case is a content change in
 * `src/content/cases.ts`, nothing more.
 */
export default function CasesPage() {
  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Cases", path: "/cases" },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">Cases</h1>
            <p className="mt-4 text-body-lg text-ink-600">
              Konkrete forløb fra kunder, vi har hjulpet — beskrevet med deres accept.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container>
          {publishedCases.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-xl border border-ink-100 bg-surface p-8 text-center">
              <h2 className="text-h3">Vi har ingen offentliggjorte cases endnu</h2>
              <p className="mt-3 text-body text-ink-600">
                Vi offentliggør først en case, når forløbet er reelt, og kunden har sagt
                ja til, hvordan det bliver beskrevet. Indtil da står der ikke noget her.
              </p>
              <p className="mt-4 text-small text-ink-500">
                Vil du vide, hvad en gennemgang konkret indebærer? Så tag den korte vej og
                prøv den.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {publishedCases.map((item) => (
                <li key={item.slug} className="contents">
                  <LinkCard
                    href={`/cases/${item.slug}`}
                    title={item.title}
                    description={item.challenge}
                    meta={item.customerType === "erhverv" ? "Erhverv" : "Privat"}
                  />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
