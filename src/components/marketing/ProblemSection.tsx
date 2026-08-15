import { Container, Section } from "@/components/ui/Layout";
import { PrimaryCta } from "@/components/ui/CtaLink";

/**
 * Problem recognition.
 *
 * The goal is relevance, not fear: these are ordinary changes people recognise
 * from their own life or business. Split in two columns so a visitor can find
 * their own situation quickly instead of reading a list of everything.
 */

const privateChanges = [
  "Du har skiftet bil, eller der er kommet en ung bilist på forsikringen",
  "I er flyttet, har bygget om eller købt bolig med en overtaget aftale",
  "Der er kommet børn — eller børnene er flyttet hjemmefra",
  "Indbosummen er den samme som for fem år siden",
  "Du betaler for rejsedækning både på forsikringen og på et kreditkort",
  "Selvrisikoen blev valgt engang, uden at du har set på den siden",
];

const businessChanges = [
  "I er blevet flere ansatte, eller lønsummen har ændret sig",
  "Der er investeret i nye maskiner, biler eller udstyr",
  "Omsætningen er vokset siden aftalen blev lavet",
  "I har fået nye aktiviteter eller nye typer opgaver",
  "I er flyttet, eller der er kommet flere adresser",
  "Aftalerne er tegnet på forskellige tidspunkter og hænger ikke sammen",
];

function ChangeList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-h3">{title}</h3>
      <ul className="mt-4 space-y-0 divide-y divide-ink-100 border-t border-ink-100">
        {items.map((item) => (
          <li key={item} className="flex gap-3 py-3.5 text-body text-ink-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="mt-1.5 shrink-0 text-ink-300"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProblemSection() {
  return (
    <Section tone="canvas">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
              Hvornår er det relevant?
            </p>
            <h2 className="mt-3 text-h2">
              Forsikringer bliver sjældent forkerte på én gang
            </h2>
            <p className="mt-4 text-body-lg text-ink-600">
              De bliver det langsomt — når livet eller virksomheden ændrer sig, og aftalen
              bliver stående, som den var.
            </p>
            <div className="mt-7 hidden lg:block">
              <PrimaryCta location="hero" size="md" />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            <ChangeList title="Privat" items={privateChanges} />
            <ChangeList title="Erhverv" items={businessChanges} />
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          <PrimaryCta location="hero" fullWidth />
        </div>
      </Container>
    </Section>
  );
}
