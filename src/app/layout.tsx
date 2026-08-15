import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { TagScripts } from "@/components/analytics/TagScripts";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.siteName} — få gennemgået dine forsikringer`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.siteName,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c1a2b",
  colorScheme: "light",
};

/**
 * Root layout holds only what every surface needs: fonts, the consent
 * mechanism and page-view tracking. The public site's header and footer live
 * in the (site) route group, so the CRM does not inherit marketing chrome.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}

        <ConsentBanner />
        <TagScripts />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
