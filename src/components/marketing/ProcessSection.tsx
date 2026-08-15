import { Container, Section, SectionHeading } from "@/components/ui/Layout";

const steps = [
  {
    title: "Fortæl kort om din situation",
    body: "To til tre minutter i et enkelt skema. Ingen lange formularer og ingen forsikringssprog.",
  },
  {
    title: "Vi gennemgår dine behov",
    body: "En rådgiver ser på det, du har i dag, og hvad der er relevant for din situation.",
  },
  {
    title: "Du får en konkret gennemgang",
    body: "Hvor dækningen passer, hvor der mangler noget, og hvor du eventuelt betaler for det samme to gange.",
  },
  {
    title: "Du beslutter selv, hvad der skal ske",
    body: "Vil du ændre noget, hjælper vi med det. Vil du lade det være, er det også et resultat.",
  },
];

export function ProcessSection() {
  return (
    <Section tone="surface" id="saadan-fungerer-det">
      <Container>
        <SectionHeading
          eyebrow="Sådan fungerer det"
          title="Fire trin — og du bestemmer efter hvert af dem"
        />

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              {/* Connector drawn only between steps on wide screens. */}
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-12 right-0 top-5 hidden h-px bg-ink-100 lg:block"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="relative z-10 grid size-10 place-items-center rounded-full bg-navy font-display text-body font-bold text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-h3">{step.title}</h3>
              <p className="mt-2 text-body text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
