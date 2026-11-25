import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { CompareSection } from "@/components/marketing/CompareSection";
import { SegmentSplit } from "@/components/marketing/SegmentSplit";
import { ProcessSection } from "@/components/marketing/ProcessSection";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { CasesTeaser } from "@/components/marketing/CasesTeaser";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { homepageFaq } from "@/content/faq";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Forsikringxperten — få læst din police igennem",
  description:
    "Der står noget i din police, du aldrig har læst. En rådgiver gennemgår dine forsikringer og fortæller dig på dansk, hvad der står — og hvad der ikke gør. Privat og erhverv.",
  path: "/",
});

/**
 * Home page.
 *
 * Rhythm, deliberately alternating so no two neighbouring sections share a
 * background or a layout:
 *
 *   1  Hero            navy    the marked policy line, and the way in
 *   2  TrustStrip      white   three short facts about the process
 *   3  CompareSection  grey    the signature doing work: two agreements
 *   4  SegmentSplit    navy    is this me? — asymmetric panels
 *   5  ProcessSection  white   four steps
 *   6  CategoryGrid    grey    what we can review
 *   7  Faq             white   objections
 *   8  CtaBand         navy    ask
 *
 * Removed in this pass: ProblemSection and WhyUs. Their content was six more
 * rows of bullet-with-bold-line, immediately after TrustStrip's three — the
 * page's weakest stretch. The recognisable "has this changed for you?"
 * material now lives inside the two segment panels, where it helps the
 * visitor choose instead of sitting in a list of its own.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CompareSection />
      <SegmentSplit />
      <ProcessSection />
      <CategoryGrid />
      <CasesTeaser />
      <FaqSection items={homepageFaq} context="homepage" />
      <CtaBand />
    </>
  );
}
