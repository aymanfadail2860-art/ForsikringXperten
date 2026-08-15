import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { PrimaryCta, SecondaryCta } from "@/components/ui/CtaLink";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ctaTrustLine, segmentCta } from "@/config/cta";
import { getIndustry, industries } from "@/content/industries";
import { getProduct } from "@/content/products";
import { guides } from "@/content/guides";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  return buildMetadata({
    title: industry.title,
    description: industry.metaDescription,
    path: `/brancher/${industry.slug}`,
  });
}

/**
 * Industry page.
 *
 * Structured to be genuinely useful rather than a keyword landing page: the
 * risks are described concretely, and the cover areas link into the product
 * pages so the content cluster is connected in both directions.
 */
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const products = industry.relevantProducts
    .map((productSlug) => getProduct("erhverv", productSlug))
    .filter((p) => Boolean(p));

  const relatedGuides = guides.filter((guide) =>
    guide.relatedIndustries?.includes(industry.slug),
  );

  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Brancher", path: "/brancher" },
              { name: industry.name, path: `/brancher/${industry.slug}` },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">{industry.title}</h1>
            <p className="mt-4 text-body-lg text-ink-600">{industry.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta
                location="industry_page"
                size="md"
                label={segmentCta.business.label}
                href={segmentCta.business.href}
              />
              <SecondaryCta location="industry_page" size="md" />
            </div>
            <p className="mt-4 text-small text-ink-500">{ctaTrustLine}</p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container>
          <SectionHeading
            eyebrow="Typiske risici"
            title="Hvad går der typisk galt i branchen?"
            description="Ikke for at male fanden på væggen — men fordi det er de her situationer, dækningen skal kunne holde til."
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {industry.risks.map((risk) => (
              <div key={risk.title} className="border-t border-ink-200 pt-5">
                <h3 className="text-h3">{risk.title}</h3>
                <p className="mt-2 text-body text-ink-600">{risk.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Forsikringsområder"
                title="Hvad bør virksomheden undersøge?"
              />
              <ul className="mt-6 space-y-3">
                {products.map((product) => (
                  <li key={product!.slug}>
                    <Link
                      href={`/erhverv/${product!.slug}`}
                      className="group flex items-start justify-between gap-4 rounded-lg border border-ink-100 p-4 transition-colors hover:border-accent-200 hover:bg-accent-50/40"
                    >
                      <span>
                        <span className="block text-body font-semibold text-ink-900">
                          {product!.title}
                        </span>
                        <span className="mt-1 block text-small text-ink-600">
                          {product!.summary}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {industry.additionalAreas.length > 0 ? (
                <div className="mt-6 rounded-lg bg-ink-50 p-5">
                  <h3 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-500">
                    Ofte også relevant
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {industry.additionalAreas.map((area) => (
                      <li
                        key={area}
                        className="rounded-md bg-surface px-2.5 py-1 text-small text-ink-700"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div>
              <SectionHeading
                eyebrow="Hvornår bør I kigge på det?"
                title="Ændringer, der plejer at betyde noget"
              />
              <ul className="mt-6 divide-y divide-ink-100 border-t border-ink-100">
                {industry.changeTriggers.map((trigger) => (
                  <li key={trigger} className="py-3.5 text-body text-ink-600">
                    {trigger}
                  </li>
                ))}
              </ul>

              {relatedGuides.length > 0 ? (
                <div className="mt-8">
                  <h3 className="text-h3">Læs mere</h3>
                  <ul className="mt-3 space-y-1.5">
                    {relatedGuides.map((guide) => (
                      <li key={guide.slug}>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="text-body font-medium text-accent-700 hover:underline"
                        >
                          {guide.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-10 max-w-3xl border-t border-ink-100 pt-5 text-small text-ink-500">
            Beskrivelserne her er generelle og gælder ikke automatisk for alle
            virksomheder i branchen. Hvad der er relevant for netop jer, afhænger af
            jeres aktiviteter, størrelse og de aftaler, I har i dag.
          </p>
        </Container>
      </Section>

      <CtaBand
        title={`Skal vi gennemgå forsikringerne i din ${industry.name.toLowerCase()}-virksomhed?`}
        description="Fortæl kort om virksomheden, så vender en rådgiver tilbage med en konkret gennemgang."
        location="industry_page"
      />
    </>
  );
}
