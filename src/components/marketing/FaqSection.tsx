import Link from "next/link";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo/jsonld";

export function FaqSection({
  items,
  title = "Spørgsmål, folk stiller inden de starter",
  eyebrow = "Ofte stillede spørgsmål",
  context,
  showAllLink = true,
  /** Emit FAQPage structured data. Only one block per page. */
  structuredData = true,
  id = "faq",
}: {
  items: AccordionItem[];
  title?: string;
  eyebrow?: string;
  context?: string;
  showAllLink?: boolean;
  structuredData?: boolean;
  id?: string;
}) {
  return (
    <Section tone="surface" id={id}>
      <Container width="content">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-8">
          <Accordion items={items} context={context} />
        </div>
        {showAllLink ? (
          <p className="mt-6 text-small text-ink-600">
            Har du et andet spørgsmål?{" "}
            <Link href="/kontakt" className="font-semibold text-accent-700 underline">
              Skriv til os
            </Link>
            .
          </p>
        ) : null}
      </Container>
      {structuredData ? <JsonLd data={faqJsonLd(items)} /> : null}
    </Section>
  );
}
