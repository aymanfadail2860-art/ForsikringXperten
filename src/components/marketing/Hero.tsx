import { Container } from "@/components/ui/Layout";
import { PolicyExcerpt } from "./PolicyExcerpt";
import { HeroStarter } from "./HeroStarter";
import { heroExcerpt, heroNotes, type HeroVariant } from "@/content/policyExamples";
import { publicResponseTime } from "@/config/site";

/**
 * Home page hero.
 *
 * The composition is one object: a policy page with one line marked, and
 * directly beneath it the question that starts a review of the visitor's own.
 * Evidence, then action, in a single card — so the thing that catches the eye
 * is also the thing that converts.
 *
 * The headline carries its weight on "police": that noun is the only word on
 * the screen that could not belong to a bank or a telephone company, and it
 * is set on its own line on a phone for exactly that reason.
 */
export function Hero({ variant = "a" }: { variant?: HeroVariant }) {
  const nextStepLine = publicResponseTime
    ? `En rådgiver kontakter dig ${publicResponseTime}.`
    : "Du hører fra en rådgiver, inden der sker noget som helst.";

  return (
    <section className="relative overflow-hidden bg-navy on-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(52rem 30rem at 82% -12%, rgba(74,222,154,0.15), transparent 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, #000 18%, transparent 90%)",
        }}
      />

      <Container className="relative py-7 sm:py-14 lg:py-20">
        <div className="grid gap-6 sm:gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start lg:gap-16">
          <div className="animate-rise">
            {/* The headline already says what this is; on a phone the eyebrow
                costs a line the choice below needs more. */}
            <p className="hidden text-caption font-semibold uppercase tracking-[0.14em] text-highlight sm:block">
              Forsikringstjek
            </p>
            {/*
              Line breaks are set by hand on phones: "police" must not share a
              line with "du aldrig", or the sentence loses its pivot. The
              <br> only applies below sm, where the measure is narrow enough
              for the browser to break it badly.
            */}
            <h1 className="text-[2.125rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-white hyphens-manual sm:mt-3.5 sm:text-[3rem] sm:leading-[3.15rem] lg:text-display">
              Der står noget i din police,
              <br className="hidden sm:block" /> du aldrig har læst
            </h1>
            <p className="mt-3.5 max-w-md text-body text-ink-200 sm:text-body-lg">
              En rådgiver læser den igennem og siger det på dansk.
            </p>
            {/*
              Desktop only. The right-hand card is tall, and without this the
              left column left a large empty field under the headline — the
              weakest thing in the first draft of this layout.

              It is not filler: it carries the signature's language further.
              Clause numbers and the green marker are becoming the site's way
              of saying "this is the kind of line we look for", so repeating
              that grammar here teaches it before the visitor meets it again
              in the comparison further down.
            */}
            <div className="mt-9 hidden lg:block">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-400">
                Det er typisk her, vi finder noget
              </p>
              <ul className="mt-4 max-w-md divide-y divide-white/10 border-t border-white/10">
                {[
                  { ref: "4.4", term: "Selvrisiko", rest: "beløbet du selv betaler" },
                  { ref: "6.1", term: "Indbosum", rest: "sat dengang I flyttede ind?" },
                  { ref: "9.3", term: "Undtagelser", rest: "det der ikke er dækket" },
                ].map((item) => (
                  <li key={item.ref} className="flex items-baseline gap-3 py-2.5">
                    <span className="font-mono text-caption text-ink-400">{item.ref}</span>
                    <span className="text-small text-ink-200">
                      <span className="-mx-1 rounded-sm bg-[var(--color-marker-dark)] px-1 font-semibold text-highlight">
                        {item.term}
                      </span>{" "}
                      — {item.rest}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-small text-ink-300">
                {nextStepLine} Uforpligtende, og du bestemmer selv resten.
              </p>
            </div>
          </div>

          {/* Evidence and action in one card. */}
          <div className="animate-rise rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-lg backdrop-blur-sm [animation-delay:120ms]">
            <div className="rounded-xl bg-surface p-4 sm:p-5">
              <PolicyExcerpt
                bare
                title={heroExcerpt.title}
                lines={heroExcerpt.lines}
                note={heroNotes[variant]}
              />
              <div className="my-3.5 border-t border-ink-100" />
              <HeroStarter />
              <p className="mt-3.5 hidden border-t border-ink-100 pt-3 text-small text-ink-500 sm:block">
                Ingen CPR-nummer, helbredsoplysninger eller betalingsoplysninger.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
