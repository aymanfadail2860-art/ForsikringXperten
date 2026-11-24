import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { LinkCard } from "@/components/ui/Card";
import { PrimaryCta, SecondaryCta } from "@/components/ui/CtaLink";
import { CtaBand } from "./CtaBand";
import { OfferReviewCallout } from "./OfferReviewCallout";
import { FaqSection } from "./FaqSection";
import { ctaTrustLine, segmentCta } from "@/config/cta";
import { productsBySegment, type Segment } from "@/content/products";
import { guidesForAudience } from "@/content/guides";
import { industries } from "@/content/industries";
import type { FaqItem } from "@/content/faq";

/** Shared layout for /privat and /erhverv. */
export function SegmentOverview({
  segment,
  title,
  intro,
  changes,
  faq,
}: {
  segment: Segment;
  title: string;
  intro: string;
  /** Concrete situations where a review is usually relevant. */
  changes: string[];
  faq: FaqItem[];
}) {
  const products = productsBySegment(segment);
  const cta = segment === "erhverv" ? segmentCta.business : segmentCta.private;
  const relatedGuides = guidesForAudience(segment).slice(0, 3);
  const label = segment === "erhverv" ? "Erhverv" : "Privat";

  return (
    <>
      <div className="bg-navy on-dark">
        <Container className="py-14 sm:py-18">
          <div className="[&_a]:text-ink-300 [&_a:hover]:text-white [&_span]:text-ink-400 [&_ol]:text-ink-300">
            <Breadcrumbs
              crumbs={[
                { name: "Forside", path: "/" },
                { name: label, path: `/${segment}` },
              ]}
            />
          </div>

          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1 text-white sm:text-[3rem] sm:leading-[3.25rem]">
              {title}
            </h1>
            <p className="mt-5 text-body-lg text-ink-200">{intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta location="product_page" label={cta.label} href={cta.href} />
              <SecondaryCta location="product_page" variant="onDark" />
            </div>
            <p className="mt-5 text-small text-ink-300">{ctaTrustLine}</p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container>
          <SectionHeading
            eyebrow="Områder"
            title="Hvad vi kan gennemgå"
            description="Du behøver ikke vælge på forhånd — men det giver et hurtigere udgangspunkt."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug} className="contents">
                <LinkCard
                  href={`/${segment}/${product.slug}`}
                  title={product.title}
                  description={product.summary}
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Hvornår er det relevant?"
              title={
                segment === "erhverv"
                  ? "Virksomheder ændrer sig hurtigere end deres forsikringer"
                  : "Livet ændrer sig hurtigere end forsikringerne"
              }
            />
            <ul className="divide-y divide-ink-100 border-t border-ink-100">
              {changes.map((change) => (
                <li key={change} className="py-3.5 text-body text-ink-600">
                  {change}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {segment === "erhverv" ? (
        <Section tone="canvas" size="sm">
          <Container>
            <OfferReviewCallout location="product_page" audience="erhverv" />
          </Container>
        </Section>
      ) : null}

      {segment === "erhverv" ? (
        <Section tone="canvas" size="sm">
          <Container>
            <SectionHeading
              eyebrow="Brancher"
              title="Se hvad der typisk er i spil i din branche"
            />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/brancher/${industry.slug}`}
                    className="inline-block rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-small font-semibold text-ink-700 transition-colors hover:border-accent-300 hover:text-accent-700"
                  >
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {relatedGuides.length > 0 ? (
        <Section tone={segment === "erhverv" ? "surface" : "surface"} size="sm">
          <Container>
            <SectionHeading eyebrow="Guides" title="Læs mere, inden du beslutter noget" />
            <ul className="mt-8 grid gap-5 sm:grid-cols-3">
              {relatedGuides.map((guide) => (
                <li key={guide.slug} className="contents">
                  <LinkCard
                    href={`/guides/${guide.slug}`}
                    title={guide.title}
                    description={guide.summary}
                    meta={`${guide.readingMinutes} min`}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <FaqSection
        items={faq}
        title="Spørgsmål om gennemgangen"
        context={`segment_${segment}`}
      />

      <CtaBand title={cta.label + "?"} location="product_page" />
    </>
  );
}
