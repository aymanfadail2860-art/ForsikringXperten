import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { privateProducts, businessProducts } from "@/content/products";

/**
 * Insurance areas. A compact link grid rather than a wall of identical icon
 * cards — the job here is navigation and internal linking, not decoration.
 */
function Column({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: { slug: string; title: string; name: string }[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink-100 pb-3">
        <h3 className="text-h3">{title}</h3>
        <Link href={href} className="text-small font-semibold text-accent-700">
          Se alle →
        </Link>
      </div>
      <ul className="mt-2 grid sm:grid-cols-2">
        {products.map((product) => (
          <li key={product.slug}>
            <Link
              href={`${href}/${product.slug}`}
              className="group flex items-center justify-between gap-3 rounded-lg px-3 py-3 -mx-3 transition-colors hover:bg-ink-50"
            >
              <span className="text-body font-medium text-ink-800">{product.title}</span>
              <span
                aria-hidden="true"
                className="text-ink-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-600"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryGrid() {
  return (
    <Section tone="canvas">
      <Container>
        <SectionHeading
          eyebrow="Områder"
          title="Hvad kan vi hjælpe med?"
          description="Vi gennemgår gerne det hele på én gang — men du kan også starte med ét område."
        />
        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Column title="Privat" href="/privat" products={privateProducts} />
          <Column title="Erhverv" href="/erhverv" products={businessProducts} />
        </div>
      </Container>
    </Section>
  );
}
