import type { Metadata } from "next";
import { FrontPage } from "@/components/marketing/FrontPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Forsikringxperten — få læst din police igennem",
  description:
    "Der står noget i din police, du aldrig har læst. En rådgiver gennemgår dine forsikringer og fortæller dig på dansk, hvad der står — og hvad der ikke gør. Privat og erhverv.",
  path: "/",
});

/** Variant A — the live front page. See /forside-b for the note under test. */
export default function HomePage() {
  return <FrontPage variant="a" />;
}
