import { Hero } from "./Hero";
import { TrustStrip } from "./TrustStrip";
import { CompareSection } from "./CompareSection";
import { SegmentSplit } from "./SegmentSplit";
import { ProcessSection } from "./ProcessSection";
import { CategoryGrid } from "./CategoryGrid";
import { CasesTeaser } from "./CasesTeaser";
import { FaqSection } from "./FaqSection";
import { CtaBand } from "./CtaBand";
import { homepageFaq } from "@/content/faq";
import type { HeroVariant } from "@/content/policyExamples";

/**
 * The front page, shared by both hero variants.
 *
 * Only the advisor's note in the hero differs between A and B. Everything
 * else — headline, excerpt, buttons, every section below — is literally the
 * same component tree, so a difference in behaviour between the two URLs can
 * only come from the note.
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
 */
export function FrontPage({ variant = "a" }: { variant?: HeroVariant }) {
  return (
    <>
      <Hero variant={variant} />
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
