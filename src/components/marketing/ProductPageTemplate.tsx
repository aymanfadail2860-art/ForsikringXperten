import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { PrimaryCta, SecondaryCta } from "@/components/ui/CtaLink";
import { CtaBand } from "./CtaBand";
import { ctaTrustLine, segmentCta } from "@/config/cta";
import { getProduct, type Product } from "@/content/products";
import { guides } from "@/content/guides";

/**
 * Shared template for every product page.
 *
 * The structure answers the four questions a reader has, in order: what is it,
 * when is it relevant to me, what should I check myself, and what do I do now.
 * Using one template keeps 13 pages consistent and makes adding a product a
 * content change rather than a design exercise.
 */
export function ProductPageTemplate({ product }: { product: Product }) {
  const segmentLabel = product.segment === "erhverv" ? "Erhverv" : "Privat";
  const segmentPath = `/${product.segment}`;
  const cta = product.segment === "erhverv" ? segmentCta.business : segmentCta.private;

  const related = product.related
    .map((slug) => getProduct(product.segment, slug))
    .filter((p): p is Product => Boolean(p));

  const relatedGuides = guides.filter((guide) =>
    guide.relatedProducts.some(
      (rp) => rp.segment === product.segment && rp.slug === product.slug,
    ),
  );

  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: segmentLabel, path: segmentPath },
              { name: product.title, path: `${segmentPath}/${product.slug}` },
            ]}
          />

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            <div>
              <h1 className="text-h1">{product.title}</h1>
              <p className="mt-4 max-w-2xl text-body-lg text-ink-600">{product.summary}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryCta
                  location="product_page"
                  size="md"
                  label={cta.label}
                  href={cta.href}
                />
                <SecondaryCta location="product_page" size="md" />
              </div>
              <p className="mt-4 text-small text-ink-500">{ctaTrustLine}</p>
            </div>

            <aside className="rounded-xl border border-ink-100 bg-canvas p-5 lg:mt-0">
              <h2 className="text-small font-semibold uppercase tracking-[0.1em] text-ink-400">
                Hvad dækker den typisk?
              </h2>
              <ul className="mt-4 space-y-2.5">
                {product.covers.map((item) => (
                  <li key={item} className="flex gap-2.5 text-small text-ink-700">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-accent-600"
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
              <p className="mt-4 border-t border-ink-100 pt-3 text-caption text-ink-500">
                Det konkrete indhold afhænger af den enkelte police og det selskab,
                aftalen er tegnet hos.
              </p>
            </aside>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Hvornår er det relevant?"
                title="Situationer, hvor dækningen ofte ikke passer længere"
              />
              <ul className="mt-6 divide-y divide-ink-100 border-t border-ink-100">
                {product.reviewTriggers.map((trigger) => (
                  <li key={trigger} className="py-3.5 text-body text-ink-600">
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                eyebrow="Tjek selv"
                title="Fire spørgsmål, du kan stille din egen police"
              />
              <ol className="mt-6 space-y-4">
                {product.checkYourself.map((question, i) => (
                  <li key={question} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-full bg-navy text-caption font-bold text-white"
                    >
                      {i + 1}
                    </span>
                    <span className="text-body text-ink-700">{question}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-small text-ink-500">
                Kan du ikke svare på dem alle, er det som regel et godt tegn på, at en
                gennemgang er tiden værd.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 || relatedGuides.length > 0 ? (
        <Section tone="surface" size="sm">
          <Container>
            <div className="grid gap-10 sm:grid-cols-2">
              {related.length > 0 ? (
                <div>
                  <h2 className="text-h3">Hænger ofte sammen med</h2>
                  <ul className="mt-4 space-y-2">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/${item.segment}/${item.slug}`}
                          className="text-body font-medium text-accent-700 hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="text-small text-ink-500">{item.summary}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {relatedGuides.length > 0 ? (
                <div>
                  <h2 className="text-h3">Læs mere</h2>
                  <ul className="mt-4 space-y-2">
                    {relatedGuides.map((guide) => (
                      <li key={guide.slug}>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="text-body font-medium text-accent-700 hover:underline"
                        >
                          {guide.title}
                        </Link>
                        <p className="text-small text-ink-500">{guide.summary}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        title={
          product.segment === "erhverv"
            ? "Skal vi kigge på virksomhedens forsikringer?"
            : `Skal vi kigge på din ${product.title.toLowerCase()}?`
        }
        location="product_page"
      />
    </>
  );
}
