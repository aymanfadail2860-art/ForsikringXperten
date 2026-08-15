import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/Layout";
import { PrimaryCta, PhoneLink } from "@/components/ui/CtaLink";
import { ButtonLink } from "@/components/ui/Button";
import { getBookingProvider } from "@/services/calendar";
import { buildMetadata } from "@/lib/seo/metadata";
import { phoneIsPublic } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Book en samtale",
  description:
    "Book en uforpligtende samtale om dine forsikringer. Fortæl kort om din situation, så finder vi et tidspunkt, der passer.",
  path: "/book",
});

const meetingTypes = [
  {
    title: "Telefonmøde",
    body: "Det mest almindelige. Vi ringer på det aftalte tidspunkt og gennemgår det, du har sendt ind.",
  },
  {
    title: "Videomøde",
    body: "Praktisk, hvis vi skal se på policer eller dokumenter sammen undervejs.",
  },
  {
    title: "Fysisk møde",
    body: "Relevant ved større erhvervsgennemgange, hvor der er meget at se på.",
  },
];

/**
 * Booking page.
 *
 * When a scheduling link is configured, it is shown directly. When it is not,
 * the page routes into the funnel with "book a time" as the contact preference
 * — a real, working path rather than a calendar with invented slots.
 */
export default function BookingPage() {
  const provider = getBookingProvider();
  const externalUrl = provider.getExternalUrl();

  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Book en samtale", path: "/book" },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">Book en samtale</h1>
            <p className="mt-4 text-body-lg text-ink-600">
              En gennemgang tager typisk 20–30 minutter, afhængigt af hvor mange
              forsikringer der skal ses på. Du forpligter dig ikke til noget.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container width="content">
          <div className="rounded-xl border border-ink-100 bg-surface p-7 sm:p-9">
            {externalUrl ? (
              <>
                <h2 className="text-h2">Vælg et tidspunkt</h2>
                <p className="mt-3 text-body text-ink-600">
                  Vælg selv en tid i kalenderen. Du får en bekræftelse med det samme.
                </p>
                <div className="mt-6">
                  <ButtonLink href={externalUrl} size="lg" target="_blank" rel="noopener noreferrer">
                    Åbn kalenderen
                  </ButtonLink>
                </div>
                <p className="mt-6 border-t border-ink-100 pt-5 text-small text-ink-500">
                  Vil du hellere sende din situation først? Så kan rådgiveren nå at
                  forberede sig, inden I taler sammen.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-h2">Fortæl først kort om din situation</h2>
                <p className="mt-3 text-body text-ink-600">
                  Vi finder tidspunktet sammen med dig. Start forsikringstjekket og vælg{" "}
                  <span className="font-semibold text-ink-800">
                    “Book en tid i kalenderen”
                  </span>{" "}
                  til sidst — så vender vi tilbage med et forslag.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <PrimaryCta location="contact" label="Start og book en tid" />
                  {phoneIsPublic ? (
                    <PhoneLink
                      location="contact"
                      className="text-small font-semibold text-accent-700 underline underline-offset-4"
                    >
                      Eller ring til os
                    </PhoneLink>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-h3">Mødeformer</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-3">
              {meetingTypes.map((type) => (
                <li
                  key={type.title}
                  className="rounded-xl border border-ink-100 bg-surface p-5"
                >
                  <h3 className="text-body font-semibold text-ink-900">{type.title}</h3>
                  <p className="mt-1.5 text-small text-ink-600">{type.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
