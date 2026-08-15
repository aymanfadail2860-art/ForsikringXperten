import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { featuredCases, publishedCases } from "@/content/cases";

/**
 * Social proof.
 *
 * Renders nothing when there are no real, published cases. That is the correct
 * behaviour — an empty section is honest, a fabricated testimonial is not.
 */
export function CasesTeaser() {
  const items = (featuredCases.length ? featuredCases : publishedCases).slice(0, 3);
  if (items.length === 0) return null;

  return (
    <Section tone="canvas">
      <Container>
        <SectionHeading
          eyebrow="Cases"
          title="Gennemgange, vi har lavet"
          description="Konkrete forløb fra kunder, der har sagt ja til, at vi må fortælle om dem."
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Card as="li" key={item.slug} className="flex flex-col">
              <span className="text-caption font-semibold uppercase tracking-[0.1em] text-ink-400">
                {item.customerType === "erhverv" ? "Erhverv" : "Privat"}
              </span>
              <h3 className="mt-2 text-h3">{item.title}</h3>
              <p className="mt-2 text-small text-ink-600">{item.challenge}</p>
              <Link
                href={`/cases/${item.slug}`}
                className="mt-auto pt-5 text-small font-semibold text-accent-600"
              >
                Læs casen →
              </Link>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
