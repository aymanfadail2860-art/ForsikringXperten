import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt
 *
 * The admin area, the API and the campaign landing pages are kept out of the
 * index. `/forsikringstjek` is disallowed too: it is a form, and indexing it
 * only produces a thin result that competes with the pages meant to rank.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/lp/",
          "/forsikringstjek",
          // Hero variant B: the same page as "/" with one sentence changed.
          "/forside-b",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
