import { Container } from "@/components/ui/Layout";
import { SecondaryCta, PhoneLink } from "@/components/ui/CtaLink";
import { HeroStarter } from "./HeroStarter";
import { publicResponseTime, handlesSwitching } from "@/config/site";

/**
 * Home page hero.
 *
 * Two jobs, split across the two columns: the left says what the visitor
 * actually receives, the right lets them start without changing page.
 *
 * The headline is an open question, not a yes/no one: "er dine forsikringer
 * stadig de rigtige?" can be answered "ja" and closed, this one cannot. It
 * promises information rather than a saving, so it commits us to nothing we
 * cannot deliver.
 */

/** The three findings a review produces. Concrete, and none of them a number. */
const findings = [
  "Huller i dækningen, du ikke selv kan se",
  "Steder hvor du betaler for det samme to gange",
  "Om prisen står mål med det, du får",
];

export function Hero() {
  /**
   * Baseline is true by design; the sharper version appears only once the
   * business has confirmed a response time it can actually keep.
   */
  const nextStepLine = publicResponseTime
    ? `En rådgiver kontakter dig ${publicResponseTime}. Du bestemmer selv, hvad der sker bagefter.`
    : "Du hører fra en rådgiver, inden der sker noget som helst — og du bestemmer selv, hvad der sker bagefter.";

  return (
    <section className="relative overflow-hidden bg-navy on-dark">
      {/* Restrained depth: one soft light source, no floating gradient blobs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60rem 32rem at 78% -10%, rgba(86,200,240,0.16), transparent 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, #000 20%, transparent 92%)",
        }}
      />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        {/*
          Column 1 carries the argument in two stacked blocks, column 2 the
          action across both rows. On mobile the order becomes
          headline → start → detail, so the first thing under the promise is
          the thing we want them to do.
        */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-14 lg:gap-y-8">
          <div className="animate-rise lg:col-start-1 lg:row-start-1">
            {/* hyphens-manual: the global `hyphens: auto` rescues narrow phones, but at
                display size it split "forsikrin-ger" across lines on desktop, where
                there was room for the whole word. `overflow-wrap: anywhere` stays as
                the safety net. */}
            <h1 className="text-h1 text-white hyphens-manual sm:text-[3rem] sm:leading-[3.25rem] lg:text-display">
              Hvad dækker dine forsikringer — og hvad gør de ikke?
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-ink-200">
              En rådgiver gennemgår de policer, du har i dag, og giver dig et
              konkret svar på dækning, pris og det, du ikke selv kan se.
            </p>
          </div>

          <div className="animate-rise [animation-delay:120ms] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <HeroStarter />
          </div>

          <div className="animate-rise [animation-delay:60ms] lg:col-start-1 lg:row-start-2 lg:self-start">
            <ul className="space-y-2.5">
              {findings.map((finding) => (
                <li key={finding} className="flex gap-3 text-body text-ink-100">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-highlight"
                  >
                    <path
                      d="m4 9.3 3.2 3.2L14 5.6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {finding}
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-lg border-t border-white/10 pt-5 text-small text-ink-300">
              {nextStepLine}
              {handlesSwitching
                ? " Vælger du at flytte en forsikring, klarer vi opsigelsen for dig."
                : ""}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <SecondaryCta location="hero" variant="onDark" size="md" />
              <PhoneLink
                location="hero"
                className="text-small font-semibold text-ink-200 underline underline-offset-4 hover:text-white"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
