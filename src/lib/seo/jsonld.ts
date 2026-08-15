import { siteConfig, publicAddress, publicValue } from "@/config/site";

/**
 * Structured data.
 *
 * Only verified facts are emitted. Google treats structured data as claims
 * about a real business, so a placeholder phone number here is a genuine
 * problem, not a cosmetic one.
 */

export function organizationJsonLd() {
  const address = publicAddress();
  const phone = publicValue(siteConfig.contact.phoneHref);
  const email = publicValue(siteConfig.contact.email);
  const cvr = publicValue(siteConfig.company.cvr);
  const legalName = publicValue(siteConfig.legalName);
  const linkedin = publicValue(siteConfig.social.linkedin);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.siteName,
    ...(legalName ? { legalName } : {}),
    url: siteConfig.url,
    description: siteConfig.description,
    ...(cvr ? { identifier: { "@type": "PropertyValue", name: "CVR", value: cvr } } : {}),
    ...(address ? { address: { "@type": "PostalAddress", ...address } } : {}),
    ...(phone || email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            areaServed: "DK",
            availableLanguage: "Danish",
            ...(phone ? { telephone: phone } : {}),
            ...(email ? { email } : {}),
          },
        }
      : {}),
    ...(linkedin ? { sameAs: [linkedin] } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteConfig.url}${c.path === "/" ? "" : c.path}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  updated,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: siteConfig.language,
    dateModified: updated,
    mainEntityOfPage: `${siteConfig.url}${path}`,
    publisher: { "@type": "Organization", name: siteConfig.siteName },
  };
}
