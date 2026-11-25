import { describe, expect, it } from "vitest";
import { heroVariantForPath } from "@/lib/analytics/heroVariant";

/**
 * The variant dimension is the whole measurement plan for this release: the
 * denominator (page_view) and the numerator (lead_step_viewed) are joined by
 * it, so a mismatch between the two would silently produce a comparison of
 * nothing against nothing.
 */
describe("heroVariantForPath", () => {
  it("maps the two front-page URLs and nothing else", () => {
    expect(heroVariantForPath("/")).toBe("a");
    expect(heroVariantForPath("/forside-b")).toBe("b");
    expect(heroVariantForPath("/privat")).toBeUndefined();
    expect(heroVariantForPath("/forsikringstjek")).toBeUndefined();
    expect(heroVariantForPath("/lp/haandvaerker")).toBeUndefined();
  });

  it("tolerates a trailing slash or a stored query string", () => {
    expect(heroVariantForPath("/forside-b/")).toBe("b");
    expect(heroVariantForPath("/forside-b?utm_source=meta")).toBe("b");
    expect(heroVariantForPath("/?utm_source=meta")).toBe("a");
  });

  it("is undefined when no landing page was recorded", () => {
    expect(heroVariantForPath(undefined)).toBeUndefined();
    expect(heroVariantForPath("")).toBeUndefined();
  });
});
