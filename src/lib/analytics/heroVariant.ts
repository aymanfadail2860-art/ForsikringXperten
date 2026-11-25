/**
 * Which front-page version a visit started on.
 *
 * The two hero versions live at separate URLs, so the variant is already
 * carried by the one thing the funnel records on every event anyway: the
 * landing page. This module is the single place that maps a path to a
 * variant name, so the dimension means the same thing on the page_view that
 * forms the denominator and on the funnel events that form the numerator.
 *
 * Deliberately no new events and no cookie: a variant that can be derived
 * does not need to be stored.
 */

export type HeroVariantName = "a" | "b";

const PATHS: Record<string, HeroVariantName> = {
  "/": "a",
  "/forside-b": "b",
};

/** `undefined` for every page that is not a front-page version. */
export function heroVariantForPath(path: string | undefined): HeroVariantName | undefined {
  if (!path) return undefined;
  // Attribution stores the pathname only, but be tolerant of a stored query.
  const clean = path.split("?")[0]?.replace(/\/+$/, "") ?? "";
  return PATHS[clean === "" ? "/" : clean];
}
