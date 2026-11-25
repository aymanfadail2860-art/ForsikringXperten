import { Container, Section } from "@/components/ui/Layout";
import { PolicyExcerpt, Marked } from "./PolicyExcerpt";
import { compareExcerpts } from "@/content/policyExamples";

/**
 * Second use of the signature — and the first time it does work rather than
 * catch the eye.
 *
 * In the hero the marker says "an advisor found something". Here the same
 * marker appears on the same clause in two agreements, and the only
 * difference between the two is the thing that is marked. That is the whole
 * job, demonstrated instead of claimed.
 *
 * This section exists in place of a customer case. We have no documented
 * cases, and an invented "Lars sparede 17.000 kr." is exactly what this site
 * does not do. Showing the comparison itself proves the value without
 * requiring a customer to vouch for it.
 */
export function CompareSection() {
  return (
    <Section tone="canvas" id="to-aftaler">
      <Container>
        <div className="max-w-2xl">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-accent-700">
            Sådan læser en rådgiver
          </p>
          <h2 className="mt-3 text-h2 sm:text-[2.25rem] sm:leading-[2.6rem]">
            To aftaler. Samme punkt. <Marked>Én forskel</Marked> der betyder noget.
          </h2>
          <p className="mt-4 text-body-lg text-ink-600">
            Begge aftaler har 10 mio. kr. i dækningssum, og begge ser fornuftige ud
            på forsiden. Punkt 3.2 er stedet, hvor de skiller sig — og det er den
            slags linje, du skal kende, før du skriver under.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {compareExcerpts.map((excerpt) => (
            <div key={excerpt.label}>
              <p className="mb-2.5 text-small font-semibold text-ink-500">
                {excerpt.label}
              </p>
              <PolicyExcerpt title={excerpt.title} lines={excerpt.lines} />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 rounded-xl bg-navy p-6 on-dark sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-7">
          <p className="font-display text-h3 text-white">Hvad det betyder</p>
          <p className="text-body text-ink-200">
            Sælger virksomheden et produkt, dækker aftale A ikke et krav fra en
            slutbruger. Forskellen står i én linje på side 3 — og den er ikke med i
            prissammenligningen, nogen har sendt dig.
          </p>
        </div>

        <p className="mt-5 max-w-2xl text-small text-ink-500">
          Eksemplet er skrevet til at vise metoden. Det er ikke en kundes police, og
          tallene er ikke et tilbud. Hvad der står i din egen aftale, finder vi ud af
          sammen.
        </p>
      </Container>
    </Section>
  );
}
