import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/Layout";
import { PrimaryCta, PhoneLink } from "@/components/ui/CtaLink";
import { FaqSection } from "@/components/marketing/FaqSection";
import { contactFaq } from "@/content/faq";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  siteConfig,
  publicAddress,
  phoneIsPublic,
  emailIsPublic,
} from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Kontakt",
  description:
    "Kontakt Forsikringxperten. Start et forsikringstjek, ring til os eller skriv — så vender en rådgiver tilbage.",
  path: "/kontakt",
});

/**
 * Contact page.
 *
 * The primary path is still the funnel — it produces a far better conversation
 * than an empty message box. Phone and email are offered as real alternatives,
 * but only when they are verified in the site config.
 */
export default function ContactPage() {
  const address = publicAddress();

  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Kontakt", path: "/kontakt" },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">Kontakt os</h1>
            <p className="mt-4 text-body-lg text-ink-600">
              Den hurtigste vej til en brugbar samtale er at fortælle os lidt om din
              situation først. Så er rådgiveren forberedt, inden I taler sammen.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container width="content">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="rounded-xl border border-accent-200 bg-accent-50 p-7">
              <h2 className="text-h2">Start med et forsikringstjek</h2>
              <p className="mt-3 text-body text-ink-700">
                To til tre minutter. Så ved vi, hvad samtalen skal handle om — og du
                slipper for at forklare det hele forfra i telefonen.
              </p>
              <div className="mt-6">
                <PrimaryCta location="contact" />
              </div>
            </div>

            <div className="rounded-xl border border-ink-100 bg-surface p-7">
              <h2 className="text-h3">Vil du hellere tale med det samme?</h2>

              <dl className="mt-5 space-y-4">
                {phoneIsPublic ? (
                  <div>
                    <dt className="text-small text-ink-500">Telefon</dt>
                    <dd className="text-body-lg font-semibold text-ink-900">
                      <PhoneLink location="contact" className="hover:text-accent-700">
                        {siteConfig.contact.phone.value}
                      </PhoneLink>
                    </dd>
                    {siteConfig.contact.openingHours.verified ? (
                      <dd className="text-small text-ink-500">
                        {siteConfig.contact.openingHours.value}
                      </dd>
                    ) : null}
                  </div>
                ) : null}

                {emailIsPublic ? (
                  <div>
                    <dt className="text-small text-ink-500">E-mail</dt>
                    <dd className="text-body-lg font-semibold text-ink-900">
                      <a
                        href={`mailto:${siteConfig.contact.email.value}`}
                        className="hover:text-accent-700"
                      >
                        {siteConfig.contact.email.value}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {address ? (
                  <div>
                    <dt className="text-small text-ink-500">Adresse</dt>
                    <dd className="text-body text-ink-800">
                      <address className="not-italic">
                        {address.streetAddress}
                        <br />
                        {address.postalCode} {address.addressLocality}
                      </address>
                    </dd>
                  </div>
                ) : null}
              </dl>

              {!phoneIsPublic && !emailIsPublic && !address ? (
                <p className="mt-4 text-body text-ink-600">
                  Kontaktoplysningerne er ikke offentliggjort endnu. Brug forsikringstjekket,
                  så vender en rådgiver tilbage til dig.
                </p>
              ) : null}

              <p className="mt-6 border-t border-ink-100 pt-5 text-small text-ink-500">
                Skriv ikke CPR-nummer, helbredsoplysninger eller betalingsoplysninger i en
                almindelig e-mail. Vi beder heller aldrig om det på skrift. Se{" "}
                <Link
                  href="/privatlivspolitik"
                  className="font-medium text-accent-700 underline"
                >
                  privatlivspolitikken
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <FaqSection
        items={contactFaq}
        title="Ofte stillede spørgsmål"
        context="contact"
        showAllLink={false}
      />
    </>
  );
}
