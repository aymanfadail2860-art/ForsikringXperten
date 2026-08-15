import { Container } from "@/components/ui/Layout";
import { PrimaryCta, SecondaryCta, PhoneLink } from "@/components/ui/CtaLink";
import { ctaTrustLine } from "@/config/cta";
import type { CtaLocation } from "@/lib/analytics/events";

/**
 * Closing conversion block. One primary action, one secondary, and the phone
 * number as a quiet third option — never three competing buttons.
 */
export function CtaBand({
  title = "Skal vi kigge på dine forsikringer?",
  description = "Start med et par spørgsmål om din situation. Så vender en rådgiver tilbage med en konkret gennemgang.",
  location = "footer_cta",
}: {
  title?: string;
  description?: string;
  location?: CtaLocation;
}) {
  return (
    <section className="bg-navy on-dark">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 sm:text-[2.25rem] sm:leading-[2.6rem]">{title}</h2>
          <p className="mt-4 text-body-lg text-ink-200">{description}</p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryCta location={location} />
            <SecondaryCta location={location} variant="onDark" />
          </div>

          <p className="mt-5 text-small text-ink-300">{ctaTrustLine}</p>

          <PhoneLink
            location={location}
            className="mt-4 inline-block text-small font-semibold text-ink-200 underline underline-offset-4 hover:text-white"
          />
        </div>
      </Container>
    </section>
  );
}
