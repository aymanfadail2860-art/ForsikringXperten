import { Container } from "@/components/ui/Layout";

/**
 * Trust band under the hero.
 *
 * These are statements about how the process works — not customer counts,
 * ratings or savings claims. Everything here is true by design.
 *
 * On a phone this used to take a full screen: three rows of heading plus
 * body, which pushed the comparison section a whole swipe further away for
 * three facts that can be read in two seconds. The band now shows the
 * headings only on small screens and opens up to the full version from
 * `sm`, where the three fit side by side and the space is free.
 */
const points = [
  {
    title: "Du forpligter dig ikke",
    body: "En gennemgang er ikke det samme som at skifte. Du beslutter selv, hvad der skal ske bagefter.",
  },
  {
    title: "Vi starter i det, du har",
    body: "Vi læser dine nuværende policer — ikke et tilbud, du ikke har bedt om.",
  },
  {
    title: "Ingen følsomme oplysninger",
    body: "Vi spørger ikke om CPR-nummer, helbred eller betalingsoplysninger for at komme i gang.",
  },
];

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-accent-600 sm:size-[18px]"
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
  );
}

export function TrustStrip() {
  return (
    <div className="border-b border-ink-100 bg-surface">
      <Container>
        <ul className="grid gap-x-8 py-5 sm:grid-cols-3 sm:py-7">
          {points.map((point) => (
            <li key={point.title} className="flex gap-2.5 py-1.5 sm:py-0">
              <Check />
              <div className="min-w-0">
                <p className="text-small font-semibold text-ink-900 sm:text-body">
                  {point.title}
                </p>
                <p className="mt-1.5 hidden text-small text-ink-600 sm:block">
                  {point.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
