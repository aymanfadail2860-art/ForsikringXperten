import { privateProducts, businessProducts } from "@/content/products";
import { industries } from "@/content/industries";

export type NavLink = { label: string; href: string; description?: string };

export type NavItem = NavLink & { children?: NavLink[] };

/**
 * Primary navigation. Kept deliberately short — a megamenu is not justified
 * until the content volume demands it.
 */
export const mainNav: NavItem[] = [
  {
    label: "Privat",
    href: "/privat",
    children: privateProducts.map((p) => ({
      label: p.title,
      href: `/privat/${p.slug}`,
      description: p.name,
    })),
  },
  {
    label: "Erhverv",
    href: "/erhverv",
    children: businessProducts.map((p) => ({
      label: p.title,
      href: `/erhverv/${p.slug}`,
      description: p.name,
    })),
  },
  {
    label: "Brancher",
    href: "/brancher",
    children: industries.map((i) => ({
      label: i.name,
      href: `/brancher/${i.slug}`,
    })),
  },
  { label: "Guides", href: "/guides" },
  { label: "Om", href: "/om" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Forsikringxperten",
    links: [
      { label: "Om os", href: "/om" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Book en samtale", href: "/book" },
      { label: "Forsikringstjek", href: "/forsikringstjek" },
    ],
  },
  {
    title: "Privat",
    links: privateProducts.map((p) => ({
      label: p.title,
      href: `/privat/${p.slug}`,
    })),
  },
  {
    title: "Erhverv",
    links: businessProducts.map((p) => ({
      label: p.title,
      href: `/erhverv/${p.slug}`,
    })),
  },
  {
    title: "Viden",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "Brancher", href: "/brancher" },
      { label: "Cases", href: "/cases" },
      { label: "Ofte stillede spørgsmål", href: "/kontakt#faq" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privatlivspolitik", href: "/privatlivspolitik" },
  { label: "Cookiepolitik", href: "/cookiepolitik" },
  { label: "Vilkår", href: "/vilkaar" },
];
