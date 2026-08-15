import type { Metadata } from "next";
import { SegmentOverview } from "@/components/marketing/SegmentOverview";
import { generalFaq } from "@/content/faq";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Private forsikringer",
  description:
    "Få gennemgået dine private forsikringer — bil, hus, indbo, ulykke, rejse og sundhed. Se hvornår en gennemgang er relevant, og hvad du selv kan tjekke.",
  path: "/privat",
});

const changes = [
  "Du har skiftet bil, eller bilen er blevet ældre",
  "I er flyttet, har bygget om eller købt bolig med en overtaget aftale",
  "Der er kommet børn — eller børnene er flyttet hjemmefra",
  "Indbosummen er ikke ændret i flere år",
  "Der er kommet solceller, varmepumpe eller ladestander på boligen",
  "Du betaler for rejsedækning både på forsikringen og på et kreditkort",
  "En ung bilist er kommet på forsikringen",
];

export default function PrivatePage() {
  return (
    <SegmentOverview
      segment="privat"
      title="Dine private forsikringer — set efter i sammenhæng"
      intro="De fleste har tegnet deres forsikringer på forskellige tidspunkter og hos forskellige selskaber. En gennemgang samler dem ét sted, så du kan se, hvor dækningen passer, hvor der mangler noget, og hvor du betaler for det samme to gange."
      changes={changes}
      faq={generalFaq.slice(0, 6)}
    />
  );
}
