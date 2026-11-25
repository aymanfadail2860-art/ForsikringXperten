import type { Metadata } from "next";
import { FrontPage } from "@/components/marketing/FrontPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Forsikringxperten — få læst din police igennem",
  description:
    "Der står noget i din police, du aldrig har læst. En rådgiver gennemgår dine forsikringer og fortæller dig på dansk, hvad der står — og hvad der ikke gør. Privat og erhverv.",
  path: "/forside-b",
  // Never indexed: it is the same page as "/" with one sentence changed, and
  // two near-identical pages in the index compete with each other.
  noIndex: true,
});

/**
 * Variant B.
 *
 * A separate route rather than a query parameter, for two reasons: "/" stays
 * statically rendered (a searchParams read would make the real front page
 * dynamic for the sake of a test), and the variant lands in `landing_page`,
 * which the attribution layer already captures and stores with the lead. No
 * new event, no new column, nothing to double-count.
 *
 * A real traffic split would be a rewrite from "/" to this route, decided
 * later. This release only prepares it.
 */
export default function HomePageVariantB() {
  return <FrontPage variant="b" />;
}
