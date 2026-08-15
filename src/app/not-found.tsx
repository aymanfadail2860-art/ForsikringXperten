import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { primaryCta } from "@/config/cta";

/**
 * 404. Offers the three routes people actually want from a dead end rather
 * than just apologising.
 */
export default function NotFound() {
  return (
    <div className="grid min-h-[70dvh] place-items-center bg-canvas py-16">
      <Container width="content">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-accent-600">
            Siden findes ikke
          </p>
          <h1 className="mt-3 text-h1">Vi kunne ikke finde den side</h1>
          <p className="mt-4 text-body-lg text-ink-600">
            Linket kan være forældet, eller siden kan være flyttet. Herunder er de
            steder, folk oftest skal hen.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.shortLabel}
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="lg">
              Til forsiden
            </ButtonLink>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { href: "/privat", label: "Private forsikringer" },
              { href: "/erhverv", label: "Erhvervsforsikring" },
              { href: "/brancher", label: "Brancher" },
              { href: "/guides", label: "Guides" },
              { href: "/kontakt", label: "Kontakt" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-small font-medium text-accent-700 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
