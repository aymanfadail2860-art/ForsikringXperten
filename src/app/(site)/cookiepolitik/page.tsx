import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookiepolitik",
  description:
    "Hvilke cookies bruger Forsikringxperten, hvad bruges de til, og hvordan ændrer du dit samtykke?",
  path: "/cookiepolitik",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookiepolitik"
      intro="Her kan du se, hvilke typer cookies vi bruger, hvad de bruges til, og hvordan du ændrer dit valg."
      updated="2026-01-15"
      reviewNotice="Beskrivelsen af kategorierne svarer til, hvordan samtykkeløsningen faktisk fungerer. Den konkrete liste over cookies og deres levetid skal udfyldes, når de endelige måleværktøjer er valgt og aktiveret."
      sections={[
        {
          heading: "Hvad er cookies?",
          paragraphs: [
            "Cookies er små tekstfiler, der gemmes i din browser. De bruges blandt andet til at få en hjemmeside til at fungere, til at måle brugen af den og til at målrette annoncer.",
          ],
        },
        {
          heading: "Nødvendige cookies",
          paragraphs: [
            "Disse er nødvendige for, at hjemmesiden virker. De husker blandt andet dit cookievalg og gør, at formularerne kan indsendes sikkert.",
            "De kan ikke fravælges, fordi siden ikke fungerer uden dem. De bruges ikke til at følge dig på tværs af hjemmesider.",
          ],
        },
        {
          heading: "Statistik",
          paragraphs: [
            "Statistik hjælper os med at se, hvilke sider der bliver brugt, og hvor folk falder fra i forsikringstjekket. Det bruger vi til at gøre siden bedre.",
            "Statistikværktøjer indlæses først, når du har givet samtykke til kategorien.",
          ],
        },
        {
          heading: "Markedsføring",
          paragraphs: [
            "Markedsføringscookies bruges til at måle effekten af annoncer og til at vise relevante annoncer på andre platforme.",
            "De indlæses først, når du har givet samtykke til kategorien.",
          ],
          needsReview:
            "Konkret liste over anvendte værktøjer (fx Google Tag Manager, Google Analytics 4, Meta Pixel, LinkedIn Insight Tag, Microsoft Clarity), formål, leverandør og levetid. Udfyldes for de værktøjer, der rent faktisk aktiveres via miljøvariablerne.",
        },
        {
          heading: "Sådan ændrer du dit valg",
          paragraphs: [
            "Du kan til enhver tid ændre dit samtykke ved at klikke på “Cookieindstillinger” nederst på siden.",
            "Du kan også slette cookies i din browsers indstillinger. Så bliver du spurgt igen, næste gang du besøger siden.",
          ],
        },
        {
          heading: "Hvad sker der, hvis du siger nej?",
          paragraphs: [
            "Så indlæses hverken statistik- eller markedsføringsværktøjer. Hjemmesiden og forsikringstjekket fungerer præcis som ellers — vi kan bare ikke se, hvordan siden bliver brugt.",
          ],
        },
      ]}
    />
  );
}
