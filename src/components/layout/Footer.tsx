import Link from "next/link";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Layout";
import { ReopenConsentButton } from "@/components/analytics/ConsentBanner";
import { footerNav, legalNav } from "@/config/navigation";
import { siteConfig, publicAddress, phoneIsPublic, emailIsPublic } from "@/config/site";

/**
 * Footer. Company details render only when they are verified in the site
 * config — an insurance site showing a placeholder CVR is worse than one
 * showing none.
 */
export function Footer() {
  const address = publicAddress();
  const cvr = siteConfig.company.cvr;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy on-dark">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-small text-ink-300">
              Få gennemgået dine forsikringer, og se om dækning og pris stadig passer til
              din situation.
            </p>

            <div className="mt-5 space-y-1 text-small text-ink-300">
              {phoneIsPublic ? (
                <p>
                  <a
                    href={`tel:${siteConfig.contact.phoneHref.value}`}
                    className="hover:text-white"
                  >
                    {siteConfig.contact.phone.value}
                  </a>
                </p>
              ) : null}
              {emailIsPublic ? (
                <p>
                  <a
                    href={`mailto:${siteConfig.contact.email.value}`}
                    className="hover:text-white"
                  >
                    {siteConfig.contact.email.value}
                  </a>
                </p>
              ) : null}
              {address ? (
                <address className="not-italic">
                  {address.streetAddress}
                  <br />
                  {address.postalCode} {address.addressLocality}
                </address>
              ) : null}
              {cvr.verified ? <p>CVR {cvr.value}</p> : null}
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-highlight">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-small text-ink-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-ink-400">
            © {year} {siteConfig.siteName}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-small text-ink-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <ReopenConsentButton />
          </div>
        </div>
      </Container>
    </footer>
  );
}
