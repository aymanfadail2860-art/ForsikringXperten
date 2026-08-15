import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { allProducts } from "@/content/products";
import { industries } from "@/content/industries";
import { guides } from "@/content/guides";
import { publishedCases } from "@/content/cases";

/**
 * Sitemap.
 *
 * Generated from the same content sources as the routes, so a new product,
 * industry or guide cannot be added without appearing here.
 *
 * Deliberately excluded: /forsikringstjek (a form, not a document), /lp/*
 * (paid-traffic variants that would compete with the real pages) and /admin.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages: { path: string; priority: number; frequency: "weekly" | "monthly" | "yearly" }[] =
    [
      { path: "/", priority: 1, frequency: "weekly" },
      { path: "/privat", priority: 0.9, frequency: "monthly" },
      { path: "/erhverv", priority: 0.9, frequency: "monthly" },
      { path: "/brancher", priority: 0.8, frequency: "monthly" },
      { path: "/guides", priority: 0.8, frequency: "weekly" },
      { path: "/om", priority: 0.6, frequency: "monthly" },
      { path: "/kontakt", priority: 0.6, frequency: "monthly" },
      { path: "/book", priority: 0.6, frequency: "monthly" },
      { path: "/privatlivspolitik", priority: 0.2, frequency: "yearly" },
      { path: "/cookiepolitik", priority: 0.2, frequency: "yearly" },
      { path: "/vilkaar", priority: 0.2, frequency: "yearly" },
    ];

  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${base}${page.path === "/" ? "" : page.path}`,
    lastModified: now,
    changeFrequency: page.frequency,
    priority: page.priority,
  }));

  for (const product of allProducts) {
    entries.push({
      url: `${base}/${product.segment}/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const industry of industries) {
    entries.push({
      url: `${base}/brancher/${industry.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const guide of guides) {
    entries.push({
      url: `${base}/guides/${guide.slug}`,
      lastModified: new Date(guide.updated),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Only listed once real cases exist — see content/cases.ts.
  if (publishedCases.length > 0) {
    entries.push({
      url: `${base}/cases`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    for (const item of publishedCases) {
      entries.push({
        url: `${base}/cases/${item.slug}`,
        lastModified: new Date(item.publishedAt),
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
