import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata helper. Every page gets a unique title, description and canonical —
 * building it here means a new page cannot silently ship without them.
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
  };
}
