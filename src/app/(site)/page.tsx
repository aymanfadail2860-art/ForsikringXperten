import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { ProcessSection } from "@/components/marketing/ProcessSection";
import { SegmentSplit } from "@/components/marketing/SegmentSplit";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { WhyUs } from "@/components/marketing/WhyUs";
import { CasesTeaser } from "@/components/marketing/CasesTeaser";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaBand } from "@/components/marketing/CtaBand";
import { homepageFaq } from "@/content/faq";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Forsikringxperten — få gennemgået dine forsikringer",
  description:
    "Få gennemgået dine forsikringer af en rådgiver: huller i dækningen, steder hvor du betaler dobbelt, og om prisen står mål med det, du får. Privat og erhverv.",
  path: "/",
});

/**
 * Home page.
 *
 * Section order follows the decision the visitor is actually making:
 * value → trust → do I recognise the problem → how does it work →
 * is this for me → what areas → why you → objections → act.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <ProcessSection />
      <SegmentSplit />
      <CategoryGrid />
      <WhyUs />
      <CasesTeaser />
      <FaqSection items={homepageFaq} context="homepage" />
      <CtaBand />
    </>
  );
}
