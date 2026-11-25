import { describe, expect, it } from "vitest";
import { allProducts } from "@/content/products";
import { industries } from "@/content/industries";
import { guides } from "@/content/guides";
import { cases } from "@/content/cases";
import { landingPages } from "@/content/landingPages";
import { heroExcerpt, compareExcerpts } from "@/content/policyExamples";
import { siteConfig } from "@/config/site";
import { primaryCta } from "@/config/cta";

/**
 * Content integrity.
 *
 * These guard the two things that silently rot as content grows: broken
 * internal links, and compliance claims sneaking into copy.
 */

const productKeys = new Set(allProducts.map((p) => `${p.segment}/${p.slug}`));
const industrySlugs = new Set(industries.map((i) => i.slug));
const guideSlugs = new Set(guides.map((g) => g.slug));

describe("internal links resolve", () => {
  it("every product's related products exist in the same segment", () => {
    for (const product of allProducts) {
      for (const related of product.related) {
        expect(
          productKeys.has(`${product.segment}/${related}`),
          `${product.slug} links to missing product ${related}`,
        ).toBe(true);
      }
    }
  });

  it("every industry references real products", () => {
    for (const industry of industries) {
      for (const slug of industry.relevantProducts) {
        expect(
          productKeys.has(`erhverv/${slug}`),
          `${industry.slug} links to missing product ${slug}`,
        ).toBe(true);
      }
    }
  });

  it("every guide references real products, industries and guides", () => {
    for (const guide of guides) {
      for (const rp of guide.relatedProducts) {
        expect(
          productKeys.has(`${rp.segment}/${rp.slug}`),
          `${guide.slug} links to missing product ${rp.segment}/${rp.slug}`,
        ).toBe(true);
      }
      for (const slug of guide.relatedIndustries ?? []) {
        expect(industrySlugs.has(slug), `${guide.slug} links to missing industry ${slug}`).toBe(
          true,
        );
      }
      for (const slug of guide.relatedGuides ?? []) {
        expect(guideSlugs.has(slug), `${guide.slug} links to missing guide ${slug}`).toBe(true);
      }
    }
  });

  it("every landing page references real content", () => {
    for (const page of landingPages) {
      if (page.relatedIndustry) {
        expect(industrySlugs.has(page.relatedIndustry)).toBe(true);
      }
      for (const rp of page.relatedProducts ?? []) {
        expect(productKeys.has(`${rp.segment}/${rp.slug}`)).toBe(true);
      }
    }
  });
});

describe("slugs and metadata", () => {
  it("product slugs are unique per segment and URL-safe", () => {
    expect(new Set(productKeys).size).toBe(allProducts.length);
    for (const product of allProducts) {
      expect(product.slug).toMatch(/^[a-z0-9-]+$/);
      expect(product.metaDescription.length).toBeGreaterThan(50);
      expect(product.metaDescription.length).toBeLessThanOrEqual(200);
    }
  });

  it("industry and guide slugs are unique and URL-safe", () => {
    expect(industrySlugs.size).toBe(industries.length);
    expect(guideSlugs.size).toBe(guides.length);
    for (const slug of [...industrySlugs, ...guideSlugs]) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("every guide has substance, not a stub", () => {
    for (const guide of guides) {
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      for (const section of guide.sections) {
        expect(section.paragraphs.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("compliance guardrails", () => {
  /** Claims that need documentation before they may appear anywhere. */
  const forbiddenClaims = [
    "uvildig",
    "billigste",
    "danmarks bedste",
    "garanteret besparelse",
    "vi sammenligner alle",
    "alle forsikringsselskaber",
    "spar op til",
  ];

  const corpus = [
    ...allProducts.flatMap((p) => [
      p.summary,
      p.metaDescription,
      ...p.covers,
      ...p.reviewTriggers,
      ...p.checkYourself,
    ]),
    ...industries.flatMap((i) => [
      i.summary,
      i.metaDescription,
      ...i.risks.flatMap((r) => [r.title, r.body]),
      ...i.changeTriggers,
    ]),
    ...guides.flatMap((g) => [
      g.summary,
      g.metaDescription,
      g.intro,
      ...g.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]),
    ]),
    ...landingPages.flatMap((l) => [
      l.headline,
      l.subheadline,
      l.metaDescription,
      ...l.points.flatMap((p) => [p.title, p.body]),
    ]),
    // The signature device renders policy text, so it is held to the same rule.
    heroExcerpt.note.heading,
    heroExcerpt.note.body,
    ...heroExcerpt.lines.map((l) => l.text),
    ...compareExcerpts.flatMap((e) => e.lines.map((l) => l.text)),
  ].map((text) => text.toLowerCase());

  it("no undocumented market-coverage or savings claims in content", () => {
    for (const text of corpus) {
      for (const claim of forbiddenClaims) {
        expect(text.includes(claim), `Forbidden claim "${claim}" in: ${text}`).toBe(false);
      }
    }
  });

  it("every policy example is marked as an example, never as a real policy", () => {
    // The excerpts carry amounts and clause numbers. The components render a
    // visible "Eksempel" badge; this guards the data side — no example may
    // name a customer, a company or an insurer.
    const named = /\b(lars|mette|anders|jensen|tryg|topdanmark|alka|codan|gjensidige|if\b)/i;
    const allText = [
      heroExcerpt.title,
      heroExcerpt.note.heading,
      heroExcerpt.note.body,
      ...heroExcerpt.lines.map((l) => l.text),
      ...compareExcerpts.flatMap((e) => [e.title, e.label, ...e.lines.map((l) => l.text)]),
    ];
    for (const text of allText) {
      expect(named.test(text), `Example names a real party: ${text}`).toBe(false);
    }
    // Each comparison side must actually differ somewhere, or the section
    // demonstrates nothing.
    const [a, b] = compareExcerpts;
    expect(a && b).toBeTruthy();
    const marksA = a!.lines.filter((l) => l.marked).map((l) => l.text);
    const marksB = b!.lines.filter((l) => l.marked).map((l) => l.text);
    expect(marksA.length).toBeGreaterThan(0);
    expect(marksA).not.toEqual(marksB);
  });

  it("no fabricated social proof is published", () => {
    expect(cases.filter((c) => c.published)).toHaveLength(0);
    expect(siteConfig.socialProof.reviewScore.verified).toBe(false);
    expect(siteConfig.socialProof.customerCount.verified).toBe(false);
  });

  it("the word 'gratis' only appears in the CTA when it is documented", () => {
    if (!siteConfig.businessModel.reviewIsFree.verified) {
      expect(primaryCta.label.toLowerCase()).not.toContain("gratis");
    }
  });

  it("no unverified business fact is exposed as if it were confirmed", () => {
    // These must stay false until real values are filled in — a verified
    // placeholder would put a fake CVR or phone number on a live site.
    expect(siteConfig.company.cvr.verified).toBe(false);
    expect(siteConfig.contact.phone.verified).toBe(false);
  });
});
