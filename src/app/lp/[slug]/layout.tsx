import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Layout";
import { PhoneLink } from "@/components/ui/CtaLink";
import { legalNav } from "@/config/navigation";

/**
 * Landing page chrome.
 *
 * Reduced navigation: a paid click should not be handed six ways to leave
 * before it has read the offer. The logo, the phone number and the legal links
 * stay — removing those would be a dark pattern, not a conversion tactic.
 */
export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#indhold"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:shadow-lg"
      >
        Gå til indhold
      </a>

      <header className="border-b border-ink-100 bg-surface">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <PhoneLink
              location="landing_page"
              className="text-small font-semibold text-ink-700 hover:text-ink-900"
            />
          </div>
        </Container>
      </header>

      <main id="indhold">{children}</main>

      <footer className="border-t border-ink-100 bg-surface py-8">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-small text-ink-500">
              © {new Date().getFullYear()} Forsikringxperten
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-small text-ink-500 hover:text-ink-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
