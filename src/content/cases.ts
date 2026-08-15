/**
 * Case framework.
 *
 * ⚠️ The array below is intentionally EMPTY.
 *
 * No case may be published unless it describes a real customer engagement and
 * the customer has accepted how it is described. Components that render cases
 * handle the empty state by rendering nothing — the site simply has no case
 * section until real material exists.
 */

export type Case = {
  slug: string;
  title: string;
  customerType: "privat" | "erhverv";
  /** Industry slug from content/industries.ts, when relevant. */
  industry?: string;
  challenge: string;
  approach: string;
  outcome: string;
  testimonial?: { quote: string; author: string; role?: string };
  image?: { src: string; alt: string };
  published: boolean;
  featured: boolean;
  publishedAt: string;
};

export const cases: Case[] = [];

export const publishedCases = cases.filter((c) => c.published);

export const featuredCases = publishedCases.filter((c) => c.featured);

export function getCase(slug: string): Case | undefined {
  return publishedCases.find((c) => c.slug === slug);
}

export const hasPublishedCases = publishedCases.length > 0;
