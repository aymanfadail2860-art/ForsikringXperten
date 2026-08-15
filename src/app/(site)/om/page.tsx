import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Alert } from "@/components/ui/Alert";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  siteConfig,
  publicAddress,
  phoneIsPublic,
  emailIsPublic,
} from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Om Forsikringxperten",
  description:
    "Hvem står bag Forsikringxperten, hvordan foregår en gennemgang, og hvad kan du forvente? Læs om vores tilgang til forsikringsrådgivning.",
  path: "/om",
});

const process = [
  {
    title: "Vi starter med det, du har",
    body: "En gennemgang begynder med dine nuværende policer og din faktiske situation. Uden det er en anbefaling bare et gæt.",
  },
  {
    title: "Vi oversætter policesproget",
    body: "Selvrisiko, underforsikring og dobbeltdækning betyder noget konkret for din økonomi. Vi forklarer, hvad de betyder i netop din aftale.",
  },
  {
    title: "Du får et overblik, ikke et salgsmøde",
    body: "Du får at vide, hvor dækningen holder, hvor der mangler noget, og hvor du eventuelt betaler for det samme to gange.",
  },
  {
    title: "Du bestemmer, hvad der skal ske",
    body: "Vil du ændre noget, hjælper vi med det praktiske. Vil du lade det være, er det også et fint resultat.",
  },
];

/**
 * About page.
 *
 * Deliberately concrete about process and deliberately silent about anything we
 * cannot document. The blocks that describe the company, the advisors and how
 * we are paid render only when the corresponding values are verified in
 * `siteConfig` — see the placeholder policy there.
 */
export default function AboutPage() {
  const address = publicAddress();
  const cvr = siteConfig.company.cvr;
  const relationship = siteConfig.businessModel.providerRelationship;
  const providers = siteConfig.businessModel.namedProviders;

  const hasCompanyFacts = Boolean(address || cvr.verified || phoneIsPublic || emailIsPublic);

  const businessModelText =
    relationship === "multi-provider" && providers.length > 0
      ? `Vi samarbejder med ${providers.join(", ")}, og vi rådgiver ud fra de løsninger, de tilbyder.`
      : relationship === "single-provider" && providers[0]
        ? `Vi formidler forsikringer fra ${providers[0]}. Det betyder, at vores anbefalinger tager udgangspunkt i deres produkter.`
        : relationship === "independent"
          ? "Vi arbejder uafhængigt af det enkelte forsikringsselskab."
          : null;

  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Om os", path: "/om" },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">Om Forsikringxperten</h1>
            <p className="mt-4 text-body-lg text-ink-600">
              Vi hjælper private og virksomheder med at få overblik over deres
              forsikringer — og med at finde ud af, om dækning og pris stadig passer til
              den situation, de faktisk står i.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Hvorfor vi findes"
              title="De fleste forsikringer bliver aldrig set efter"
            />
            <div className="max-w-prose space-y-4 text-body-lg text-ink-700">
              <p>
                Forsikringer bliver tegnet, når man køber bolig, starter virksomhed eller
                får sin første bil. Derefter kører de videre af sig selv — ofte i mange år,
                uden at nogen har set på, om de stadig passer.
              </p>
              <p>
                Imens ændrer alt det andet sig. Man flytter, bygger om, får børn, ansætter
                folk, køber maskiner. Det er dér, hullerne opstår: dækning, der mangler,
                summer, der er sat for lavt, og tilvalg, man betaler for to steder.
              </p>
              <p>
                Forsikringxperten findes for at gøre den gennemgang nem at komme i gang med
                — uden at man skal sætte sig ind i policesprog først.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Sådan arbejder vi"
            title="Hvad du kan forvente af en gennemgang"
          />
          <ol className="mt-10 grid gap-8 sm:grid-cols-2">
            {process.map((step, i) => (
              <li key={step.title} className="border-t border-ink-200 pt-5">
                <span className="text-caption font-bold text-accent-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-h3">{step.title}</h3>
                <p className="mt-2 text-body text-ink-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="canvas">
        <Container width="content">
          <SectionHeading
            eyebrow="Åbenhed"
            title="Hvordan vi arbejder sammen med forsikringsselskaber"
          />
          <div className="mt-6 max-w-prose">
            {businessModelText ? (
              <p className="text-body-lg text-ink-700">{businessModelText}</p>
            ) : (
              <Alert tone="warning" title="Denne oplysning mangler stadig">
                Beskrivelsen af, hvilke forsikringsselskaber Forsikringxperten samarbejder
                med, og hvordan vi honoreres, skal udfyldes i{" "}
                <code className="rounded bg-ink-100 px-1 py-0.5 text-caption">
                  src/config/site.ts
                </code>{" "}
                under <code className="rounded bg-ink-100 px-1 py-0.5 text-caption">
                  businessModel
                </code>
                . Indtil da vises intet offentligt — vi må ikke give indtryk af en
                markedsdækning, vi ikke har.
              </Alert>
            )}
          </div>
        </Container>
      </Section>

      {hasCompanyFacts ? (
        <Section tone="surface" size="sm">
          <Container width="content">
            <SectionHeading eyebrow="Virksomheden" title="Virksomhedsoplysninger" as="h2" />
            <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {cvr.verified ? (
                <div>
                  <dt className="text-small text-ink-500">CVR</dt>
                  <dd className="text-body font-medium text-ink-900">{cvr.value}</dd>
                </div>
              ) : null}
              {address ? (
                <div>
                  <dt className="text-small text-ink-500">Adresse</dt>
                  <dd className="text-body font-medium text-ink-900">
                    {address.streetAddress}, {address.postalCode} {address.addressLocality}
                  </dd>
                </div>
              ) : null}
              {phoneIsPublic ? (
                <div>
                  <dt className="text-small text-ink-500">Telefon</dt>
                  <dd className="text-body font-medium text-ink-900">
                    <a href={`tel:${siteConfig.contact.phoneHref.value}`}>
                      {siteConfig.contact.phone.value}
                    </a>
                  </dd>
                </div>
              ) : null}
              {emailIsPublic ? (
                <div>
                  <dt className="text-small text-ink-500">E-mail</dt>
                  <dd className="text-body font-medium text-ink-900">
                    <a href={`mailto:${siteConfig.contact.email.value}`}>
                      {siteConfig.contact.email.value}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-6 text-small text-ink-500">
              Har du spørgsmål til, hvordan vi behandler dine oplysninger, kan du læse{" "}
              <Link href="/privatlivspolitik" className="font-medium text-accent-700 underline">
                privatlivspolitikken
              </Link>{" "}
              eller{" "}
              <Link href="/kontakt" className="font-medium text-accent-700 underline">
                skrive til os
              </Link>
              .
            </p>
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
