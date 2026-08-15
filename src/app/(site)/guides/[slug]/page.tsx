import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/Layout";
import { PrimaryCta } from "@/components/ui/CtaLink";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGuide, guides } from "@/content/guides";
import { getProduct } from "@/content/products";
import { getIndustry } from "@/content/industries";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/format";
import { segmentCta } from "@/config/cta";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return buildMetadata({
    title: guide.title,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    type: "article",
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const cta = guide.audience === "erhverv" ? segmentCta.business : segmentCta.private;

  const relatedProducts = guide.relatedProducts
    .map((rp) => ({ ...rp, product: getProduct(rp.segment, rp.slug) }))
    .filter((rp) => Boolean(rp.product));

  const relatedIndustries = (guide.relatedIndustries ?? [])
    .map((s) => getIndustry(s))
    .filter((i) => Boolean(i));

  const relatedGuides = (guide.relatedGuides ?? [])
    .map((s) => getGuide(s))
    .filter((g) => Boolean(g));

  return (
    <>
      <article>
        <div className="border-b border-ink-100 bg-surface">
          <Container width="content" className="py-10 sm:py-14">
            <Breadcrumbs
              crumbs={[
                { name: "Forside", path: "/" },
                { name: "Guides", path: "/guides" },
                { name: guide.title, path: `/guides/${guide.slug}` },
              ]}
            />
            <div className="mt-6">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
                {guide.audience === "erhverv"
                  ? "Erhverv"
                  : guide.audience === "privat"
                    ? "Privat"
                    : "Godt at vide"}{" "}
                · {guide.readingMinutes} min læsning
              </p>
              <h1 className="mt-3 text-h1">{guide.title}</h1>
              <p className="mt-4 max-w-2xl text-body-lg text-ink-600">{guide.intro}</p>
              <p className="mt-5 text-small text-ink-400">
                Opdateret {formatDate(guide.updated)}
              </p>
            </div>
          </Container>
        </div>

        <Section tone="canvas">
          <Container width="content">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
              <div className="max-w-prose">
                {guide.sections.map((section) => (
                  <section key={section.heading} className="mt-10 first:mt-0">
                    <h2 className="text-h2">{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-4 text-body-lg text-ink-700">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets ? (
                      <ul className="mt-5 space-y-2.5">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-body text-ink-700">
                            <span
                              aria-hidden="true"
                              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}

                <div className="mt-12 rounded-xl border border-accent-200 bg-accent-50 p-6">
                  <h2 className="text-h3">Vil du have det tjekket på din egen aftale?</h2>
                  <p className="mt-2 text-body text-ink-700">
                    Fortæl kort om din situation, så vender en rådgiver tilbage med en
                    konkret gennemgang.
                  </p>
                  <div className="mt-5">
                    <PrimaryCta
                      location="guide"
                      size="md"
                      label={cta.label}
                      href={cta.href}
                    />
                  </div>
                </div>
              </div>

              <aside className="space-y-7 lg:sticky lg:top-28 lg:self-start">
                {relatedProducts.length > 0 ? (
                  <div>
                    <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                      Relevante områder
                    </h2>
                    <ul className="mt-3 space-y-1.5">
                      {relatedProducts.map((rp) => (
                        <li key={`${rp.segment}-${rp.slug}`}>
                          <Link
                            href={`/${rp.segment}/${rp.slug}`}
                            className="text-small font-medium text-accent-700 hover:underline"
                          >
                            {rp.product!.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {relatedIndustries.length > 0 ? (
                  <div>
                    <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                      Brancher
                    </h2>
                    <ul className="mt-3 space-y-1.5">
                      {relatedIndustries.map((industry) => (
                        <li key={industry!.slug}>
                          <Link
                            href={`/brancher/${industry!.slug}`}
                            className="text-small font-medium text-accent-700 hover:underline"
                          >
                            {industry!.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {relatedGuides.length > 0 ? (
                  <div>
                    <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                      Andre guides
                    </h2>
                    <ul className="mt-3 space-y-1.5">
                      {relatedGuides.map((related) => (
                        <li key={related!.slug}>
                          <Link
                            href={`/guides/${related!.slug}`}
                            className="text-small font-medium text-accent-700 hover:underline"
                          >
                            {related!.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>
          </Container>
        </Section>
      </article>

      <CtaBand location="guide" />

      <JsonLd
        data={articleJsonLd({
          title: guide.title,
          description: guide.metaDescription,
          path: `/guides/${guide.slug}`,
          updated: guide.updated,
        })}
      />
    </>
  );
}
