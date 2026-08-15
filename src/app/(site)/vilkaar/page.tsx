import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Vilkår",
  description:
    "Vilkår for brug af Forsikringxperten.dk — hvad hjemmesiden er, hvad den ikke er, og hvad du kan forvente af en gennemgang.",
  path: "/vilkaar",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Vilkår for brug"
      intro="Vilkårene beskriver, hvad du kan forvente, når du bruger Forsikringxperten.dk og beder om en gennemgang af dine forsikringer."
      updated="2026-01-15"
      reviewNotice="Dette er et udkast, der beskriver den påtænkte brug af platformen. Vilkår i forsikringsbranchen er reguleret, og teksten skal gennemgås og godkendes af en jurist, før den kan stå som gældende vilkår."
      sections={[
        {
          heading: "Hvad hjemmesiden er",
          paragraphs: [
            "Forsikringxperten.dk giver dig mulighed for at bede om en gennemgang af dine forsikringer. Når du udfylder et forsikringstjek, sender du en anmodning om at blive kontaktet af en rådgiver.",
            "Der er ikke tale om et bindende tilbud, og der bliver ikke tegnet nogen forsikring, fordi du udfylder formularen.",
          ],
        },
        {
          heading: "Informationen på siden er generel",
          paragraphs: [
            "Beskrivelserne af forsikringsområder, brancher og begreber er generelle og skrevet for at gøre emnet forståeligt. De er ikke en beskrivelse af din konkrete police.",
            "Hvad der gælder for dig, står i dine egne forsikringsbetingelser hos dit forsikringsselskab. Er der forskel på det, du læser her, og det, der står i dine betingelser, er det betingelserne, der gælder.",
          ],
        },
        {
          heading: "Rådgivningen",
          paragraphs: [
            "En gennemgang tager udgangspunkt i de oplysninger, du giver os. Er oplysningerne ufuldstændige eller forkerte, kan gennemgangen blive det samme.",
            "Du beslutter selv, om du vil ændre noget efter en gennemgang. Du skal aldrig opsige en eksisterende forsikring, før en ny dækning er på plads.",
          ],
        },
        {
          heading: "Dine oplysninger",
          paragraphs: [
            "Vi behandler dine personoplysninger som beskrevet i privatlivspolitikken. Du skal ikke sende CPR-nummer, helbredsoplysninger eller betalingsoplysninger gennem formularerne på siden.",
          ],
        },
        {
          heading: "Tilgængelighed",
          paragraphs: [
            "Vi bestræber os på, at hjemmesiden er tilgængelig og opdateret, men vi kan ikke garantere, at den altid er fri for fejl eller nedbrud.",
          ],
        },
        {
          heading: "Ansvar og klage",
          paragraphs: [
            "Her beskrives ansvarsbegrænsning, klagemulighed og hvilken lovgivning der gælder.",
          ],
          needsReview:
            "Ansvarsbegrænsning, klageadgang (herunder relevant klageinstans), værneting og lovvalg. Skal formuleres af jurist med kendskab til reglerne for forsikringsformidling.",
        },
        {
          heading: "Ændringer",
          paragraphs: [
            "Vi kan ændre disse vilkår. Den udgave, der ligger på siden, er den gældende, og datoen for seneste opdatering står øverst.",
          ],
        },
      ]}
    />
  );
}
