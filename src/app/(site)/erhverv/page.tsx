import type { Metadata } from "next";
import { SegmentOverview } from "@/components/marketing/SegmentOverview";
import { businessFaq, generalFaq } from "@/content/faq";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Erhvervsforsikring",
  description:
    "Få gennemgået virksomhedens forsikringer — ansvar, arbejdsskade, bygninger, biler, driftstab og cyber. Se hvornår aftalerne bør ses efter.",
  path: "/erhverv",
});

const changes = [
  "I er blevet flere ansatte, eller lønsummen har ændret sig",
  "Omsætningen er vokset siden aftalerne blev lavet",
  "Der er investeret i nye maskiner, biler eller udstyr",
  "I har fået nye aktiviteter eller nye typer opgaver",
  "I er flyttet, eller der er kommet flere adresser",
  "En kunde eller et udbud stiller krav til jeres dækningssummer",
  "Aftalerne er tegnet på forskellige tidspunkter og hænger ikke sammen",
];

export default function BusinessPage() {
  return (
    <SegmentOverview
      segment="erhverv"
      title="Virksomhedens forsikringer — samlet overblik"
      intro="De fleste virksomheder har aftaler, der er lavet på forskellige tidspunkter, efterhånden som behovet opstod. En samlet gennemgang viser, hvor der mangler dækning, hvor summerne ikke længere passer til værdierne, og hvor der betales for det samme flere steder."
      changes={changes}
      faq={[...businessFaq, ...generalFaq.slice(0, 4)]}
    />
  );
}
