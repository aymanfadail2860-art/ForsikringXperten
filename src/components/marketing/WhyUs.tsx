import Link from "next/link";
import { Container, Section } from "@/components/ui/Layout";
import { siteConfig } from "@/config/site";

/**
 * "Why us".
 *
 * Written as statements about how we work — not as superlatives. Claims about
 * market coverage or independence require documentation and are therefore
 * driven by `siteConfig.businessModel`, not by copy written here.
 */

const reasons = [
  {
    title: "Vi starter med det, du allerede har",
    body: "En gennemgang begynder med dine nuværende policer. Uden det er en anbefaling bare et gæt.",
  },
  {
    title: "Almindeligt dansk, ikke policesprog",
    body: "Selvrisiko, underforsikring og dobbeltdækning betyder noget konkret for din økonomi. Det forklarer vi, så det kan bruges til noget.",
  },
  {
    title: "Én kontaktperson gennem forløbet",
    body: "Du taler med en rådgiver, der kender din sag — ikke med et nyt nummer i køen hver gang.",
  },
  {
    title: "Du får også at vide, når intet bør ændres",
    body: "Er dækningen fornuftig, siger vi det. En gennemgang, der altid ender i et skifte, er ikke en gennemgang.",
  },
];

export function WhyUs() {
  const relationship = siteConfig.businessModel.providerRelationship;
  const providers = siteConfig.businessModel.namedProviders;

  // Only describe our market position when it is documented in the config.
  const coverageNote =
    relationship === "multi-provider" && providers.length > 0
      ? `Vi samarbejder med ${providers.join(", ")}.`
      : relationship === "single-provider" && providers[0]
        ? `Vi formidler forsikringer fra ${providers[0]}.`
        : null;

  return (
    <Section tone="surface">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
              Hvorfor Forsikringxperten
            </p>
            <h2 className="mt-3 text-h2">Rådgivning, du kan bruge til at træffe et valg</h2>
            {coverageNote ? (
              <p className="mt-4 text-body text-ink-600">{coverageNote}</p>
            ) : null}
            <p className="mt-4 text-body text-ink-600">
              Du kan læse mere om, hvem der står bag, og hvordan vi arbejder, på{" "}
              <Link href="/om" className="font-semibold text-accent-700 underline">
                siden om os
              </Link>
              .
            </p>
          </div>

          <dl className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason.title}>
                <dt className="text-h3">{reason.title}</dt>
                <dd className="mt-2 text-body text-ink-600">{reason.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
