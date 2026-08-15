import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadFunnel } from "@/components/funnel/LeadFunnel";
import { Container, Section } from "@/components/ui/Layout";
import { getLandingPage, landingPages } from "@/content/landingPages";
import { getIndustry } from "@/content/industries";
import { getProduct } from "@/content/products";
import { buildMetadata } from "@/lib/seo/metadata";
import { ctaTrustLine } from "@/config/cta";

export function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/lp/${page.slug}`,
    // Campaign pages are for paid traffic. Indexing them alongside the real
    // product pages would split the ranking signals between near-duplicates.
    noIndex: true,
  });
}

/**
 * Campaign landing page.
 *
 * The funnel sits above the fold on desktop and directly under the offer on
 * mobile — a paid visitor should not have to scroll to find the action they
 * were promised.
 */
export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  const industry = page.relatedIndustry ? getIndustry(page.relatedIndustry) : undefined;
  const products = (page.relatedProducts ?? [])
    .map((rp) => ({ ...rp, product: getProduct(rp.segment, rp.slug) }))
    .filter((rp) => Boolean(rp.product));

  return (
    <>
      <Section tone="canvas" size="sm">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-14">
            <div>
              <h1 className="text-h1 sm:text-[2.75rem] sm:leading-[3rem]">
                {page.headline}
              </h1>
              <p className="mt-5 max-w-xl text-body-lg text-ink-600">
                {page.subheadline}
              </p>

              <ul className="mt-9 space-y-6">
                {page.points.map((point) => (
                  <li key={point.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-accent-600"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="m2.5 6.2 2.2 2.2L9.5 3.6"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>
                      <span className="block text-body-lg font-semibold text-ink-900">
                        {point.title}
                      </span>
                      <span className="mt-1 block text-body text-ink-600">
                        {point.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 rounded-xl border border-ink-100 bg-surface p-6">
                <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                  Det kigger vi på
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {page.checklist.map((item) => (
                    <li key={item} className="flex gap-2.5 text-small text-ink-700">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-xl border border-ink-100 bg-surface p-6 shadow-md sm:p-7">
                <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
                  Forsikringstjek
                </p>
                <p className="mt-2 text-small text-ink-600">{ctaTrustLine}</p>
                <div className="mt-5">
                  <LeadFunnel initialType={page.leadType} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {industry || products.length > 0 ? (
        <Section tone="surface" size="sm">
          <Container>
            <h2 className="text-h3">Vil du læse mere først?</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {industry ? (
                <li>
                  <Link
                    href={`/brancher/${industry.slug}`}
                    className="text-body font-medium text-accent-700 hover:underline"
                  >
                    {industry.title}
                  </Link>
                </li>
              ) : null}
              {products.map((rp) => (
                <li key={`${rp.segment}-${rp.slug}`}>
                  <Link
                    href={`/${rp.segment}/${rp.slug}`}
                    className="text-body font-medium text-accent-700 hover:underline"
                  >
                    {rp.product!.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
