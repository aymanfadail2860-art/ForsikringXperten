import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { LinkCard } from "@/components/ui/Card";
import { CtaBand } from "@/components/marketing/CtaBand";
import { guides } from "@/content/guides";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Guides om forsikring",
  description:
    "Forsikringsbegreber forklaret i almindeligt dansk: selvrisiko, underforsikring, erhvervsansvar, arbejdsskade og forskellen på hus- og indboforsikring.",
  path: "/guides",
});

const groups = [
  { key: "privat", label: "Privat" },
  { key: "erhverv", label: "Erhverv" },
  { key: "begge", label: "Godt at vide" },
] as const;

export default function GuidesPage() {
  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: "Guides", path: "/guides" },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-h1">Guides</h1>
            <p className="mt-4 text-body-lg text-ink-600">
              Forsikring er fuld af ord, der betyder noget helt konkret for din økonomi.
              Her forklarer vi dem, så du kan bruge dem til noget.
            </p>
          </div>
        </Container>
      </div>

      {groups.map((group) => {
        const items = guides.filter((guide) => guide.audience === group.key);
        if (items.length === 0) return null;

        return (
          <Section
            key={group.key}
            tone={group.key === "erhverv" ? "surface" : "canvas"}
            size="sm"
          >
            <Container>
              <SectionHeading title={group.label} as="h2" />
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((guide) => (
                  <li key={guide.slug} className="contents">
                    <LinkCard
                      href={`/guides/${guide.slug}`}
                      title={guide.title}
                      description={guide.summary}
                      meta={`${guide.readingMinutes} min læsning`}
                    />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      <CtaBand location="guide" />
    </>
  );
}
