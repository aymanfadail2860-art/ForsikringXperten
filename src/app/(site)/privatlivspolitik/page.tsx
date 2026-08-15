import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig, phoneIsPublic, emailIsPublic } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Privatlivspolitik",
  description:
    "Hvordan Forsikringxperten behandler personoplysninger: hvad vi indsamler, hvorfor, hvor længe vi gemmer det, og hvilke rettigheder du har.",
  path: "/privatlivspolitik",
});

/**
 * Privacy policy.
 *
 * The factual sections describe what the platform actually does — they are
 * derived from the database schema and the intake route, not copied from a
 * template. The identity of the data controller and the retention periods are
 * business decisions and are marked as outstanding.
 */
export default function PrivacyPage() {
  const contactLine = [
    phoneIsPublic ? siteConfig.contact.phone.value : null,
    emailIsPublic ? siteConfig.contact.email.value : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <LegalPage
      title="Privatlivspolitik"
      intro="Her kan du læse, hvilke oplysninger vi indsamler, når du bruger Forsikringxperten, hvad vi bruger dem til, og hvilke rettigheder du har."
      updated="2026-01-15"
      reviewNotice="Teksten beskriver, hvordan platformen faktisk behandler oplysninger, men den er ikke gennemgået af en jurist. Den skal godkendes — og de markerede felter udfyldes — inden siden bruges i produktion."
      sections={[
        {
          heading: "Hvem er dataansvarlig?",
          paragraphs: [
            "Den dataansvarlige er den virksomhed, der driver Forsikringxperten.",
            contactLine ? `Du kan kontakte os på ${contactLine}.` : "",
          ].filter(Boolean),
          needsReview:
            "Juridisk virksomhedsnavn, CVR-nummer, adresse og kontaktoplysninger for henvendelser om persondata. Udfyldes i src/config/site.ts.",
        },
        {
          heading: "Hvilke oplysninger indsamler vi?",
          paragraphs: [
            "Når du udfylder et forsikringstjek, beder vi om de oplysninger, der skal til for at kunne rådgive dig og vende tilbage til dig:",
          ],
          bullets: [
            "Navn, telefonnummer og e-mailadresse",
            "Hvilke forsikringsområder du ønsker gennemgået, og hvad der er vigtigst for dig",
            "Dit nuværende forsikringsselskab, hvis du oplyser det (valgfrit)",
            "For virksomheder: virksomhedsnavn, eventuelt CVR-nummer, branche og antal ansatte",
            "En eventuel besked, du selv skriver",
            "Hvordan du gerne vil kontaktes",
          ],
        },
        {
          heading: "Oplysninger vi bevidst ikke beder om",
          paragraphs: [
            "Vi beder ikke om CPR-nummer, helbredsoplysninger, detaljeret skadeshistorik, betalingskortoplysninger eller bankoplysninger i formularerne på hjemmesiden.",
            "Har du behov for at oplyse noget følsomt i forbindelse med en konkret rådgivning, aftaler vi en sikker måde at gøre det på. Send det aldrig i en almindelig e-mail.",
          ],
        },
        {
          heading: "Oplysninger om, hvordan du fandt os",
          paragraphs: [
            "Hvis du kommer til siden via en annonce eller et link, gemmer vi de kampagneparametre, der står i adressen (fx utm_source, utm_campaign, gclid og fbclid), sammen med hvilken side du landede på, og hvor du kom fra.",
            "Formålet er at kunne se, hvilke annoncer og sider der er brugbare. Oplysningerne knyttes til din henvendelse, hvis du sender en.",
          ],
        },
        {
          heading: "Statistik om, hvor langt folk når i forsikringstjekket",
          paragraphs: [
            "Vi registrerer, hvilke trin i forsikringstjekket der bliver vist og gennemført. Disse registreringer indeholder ikke navn, telefonnummer eller e-mail — kun et tilfældigt sessionsnummer og hvilket trin der er nået.",
            "Formålet er at finde ud af, hvor flowet er besværligt, så vi kan gøre det nemmere.",
          ],
        },
        {
          heading: "Hvad bruger vi oplysningerne til?",
          paragraphs: [
            "Vi bruger oplysningerne til at kontakte dig om din henvendelse, forberede og gennemføre rådgivningen, og til at forbedre hjemmesiden.",
            "Grundlaget for at kontakte dig er det samtykke, du giver, når du sender forsikringstjekket. Vi gemmer teksten på det samtykke, du har accepteret, sammen med tidspunktet — så det kan dokumenteres, hvad du sagde ja til.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "Vi bruger nødvendige cookies, for at siden kan fungere. Statistik og markedsføring bruger vi kun, hvis du har givet samtykke til det, og du kan altid ændre dit valg via linket i bunden af siden.",
            "Du kan læse mere i vores cookiepolitik.",
          ],
        },
        {
          heading: "Hvem deler vi oplysninger med?",
          paragraphs: [
            "Vi bruger eksterne leverandører til drift af hjemmesiden og opbevaring af data. De behandler kun oplysninger på vores vegne og efter vores instruks.",
          ],
          needsReview:
            "Liste over databehandlere (hosting, database, e-mail, kalender, analyseværktøjer) og oplysning om eventuel overførsel til tredjelande. Skal opdateres, når integrationerne aktiveres.",
        },
        {
          heading: "Hvor længe gemmer vi oplysningerne?",
          paragraphs: [
            "Vi gemmer din henvendelse, så længe det er nødvendigt for at behandle den og for at kunne dokumentere den rådgivning, du har fået.",
          ],
          needsReview:
            "Konkrete opbevaringsperioder for henvendelser, der ikke bliver til kunder, for kunder, og for samtykkedokumentation. Fastlægges sammen med jurist.",
        },
        {
          heading: "Dine rettigheder",
          paragraphs: [
            "Du har ret til at få indsigt i de oplysninger, vi har om dig, til at få rettet forkerte oplysninger, og til at få slettet oplysninger, når vi ikke længere har grund til at have dem.",
            "Har du givet samtykke, kan du altid trække det tilbage igen. Det påvirker ikke lovligheden af den behandling, der er sket inden.",
            "Du kan klage til Datatilsynet, hvis du er utilfreds med, hvordan vi behandler dine oplysninger.",
          ],
        },
      ]}
    />
  );
}
