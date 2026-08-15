import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

/** Public site chrome: header, footer, sticky mobile CTA and site-wide schema. */
export default function SiteLayout({
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

      <Header />
      <main id="indhold">{children}</main>
      <Footer />
      <StickyMobileCta />

      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
