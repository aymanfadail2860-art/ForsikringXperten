import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/Layout";
import { Alert } from "@/components/ui/Alert";
import { formatDate } from "@/lib/utils/format";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Marks a section that must be completed or approved before launch. */
  needsReview?: string;
};

/**
 * Shared layout for the legal pages.
 *
 * The review banner is intentionally prominent and intentionally hard to
 * forget: these texts are drafts describing how the platform actually works,
 * not documents that have been through legal approval.
 */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
  reviewNotice,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  reviewNotice: string;
}) {
  return (
    <>
      <div className="border-b border-ink-100 bg-surface">
        <Container width="content" className="py-10 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Forside", path: "/" },
              { name: title, path: "#" },
            ]}
          />
          <div className="mt-6">
            <h1 className="text-h1">{title}</h1>
            <p className="mt-4 max-w-prose text-body-lg text-ink-600">{intro}</p>
            <p className="mt-4 text-small text-ink-400">
              Senest opdateret {formatDate(updated)}
            </p>
          </div>
        </Container>
      </div>

      <Section tone="canvas">
        <Container width="content">
          <div className="max-w-prose">
            <Alert tone="warning" title="Udkast — skal godkendes juridisk">
              {reviewNotice}
            </Alert>

            {sections.map((section) => (
              <section key={section.heading} className="mt-10">
                <h2 className="text-h2">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-body text-ink-700">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-body text-ink-700">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink-300"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.needsReview ? (
                  <p className="mt-4 rounded-lg border border-warning-500/30 bg-warning-50 p-4 text-small text-warning-700">
                    <strong className="font-semibold">Skal udfyldes: </strong>
                    {section.needsReview}
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
