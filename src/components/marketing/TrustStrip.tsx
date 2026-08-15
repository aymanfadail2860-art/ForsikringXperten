import { Container } from "@/components/ui/Layout";

/**
 * Trust strip.
 *
 * These are statements about how the process works — not customer counts,
 * ratings or savings claims. Everything here is true by design and can be
 * kept regardless of which providers we work with.
 */
const points = [
  {
    title: "Du forpligter dig ikke",
    body: "En gennemgang er ikke det samme som at skifte. Du beslutter selv, hvad der skal ske bagefter.",
  },
  {
    title: "Vi tager udgangspunkt i det, du har",
    body: "Vi starter med dine nuværende forsikringer — ikke med et tilbud, du ikke har bedt om.",
  },
  {
    title: "Ingen unødvendige oplysninger",
    body: "Vi spørger ikke om CPR-nummer, helbred eller betalingsoplysninger for at komme i gang.",
  },
];

export function TrustStrip() {
  return (
    <div className="border-b border-ink-100 bg-surface">
      <Container>
        <ul className="grid gap-px overflow-hidden sm:grid-cols-3">
          {points.map((point) => (
            <li key={point.title} className="py-7 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="flex items-center gap-2 text-body font-semibold text-ink-900">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-accent-600"
                >
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" />
                  <path
                    d="m6 9.2 2 2 4-4.4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {point.title}
              </p>
              <p className="mt-1.5 text-small text-ink-600 sm:pl-[1.625rem]">{point.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
