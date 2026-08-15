import { Container } from "@/components/ui/Layout";
import { PrimaryCta, SecondaryCta } from "@/components/ui/CtaLink";
import { ctaTrustLine } from "@/config/cta";
import { ReviewPreview } from "./ReviewPreview";

/**
 * Home page hero.
 *
 * The headline asks the question the visitor is actually able to answer
 * ("is this still right for me?") rather than announcing what we sell. The
 * visual next to it shows what a forsikringstjek is, so the CTA is understood
 * before it is clicked.
 */
export function Hero() {
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

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,29rem)]">
          <div className="animate-rise">
            <h1 className="text-h1 text-white sm:text-display">
              Er dine forsikringer stadig de rigtige for dig?
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-ink-200">
              Få gennemgået dine forsikringer, og se om pris, dækning og den samlede
              løsning stadig passer til din situation.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta location="hero" />
              <SecondaryCta location="hero" variant="onDark" />
            </div>

            <p className="mt-5 flex items-center gap-2 text-small text-ink-300">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-highlight"
              >
                <path
                  d="M8 1.5 2.75 3.6v4.3c0 3.1 2.1 5.5 5.25 6.6 3.15-1.1 5.25-3.5 5.25-6.6V3.6L8 1.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path
                  d="m5.9 8 1.5 1.5 2.8-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {ctaTrustLine}
            </p>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <ReviewPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
