import { expect, test, type Page } from "@playwright/test";

/**
 * Site-wide guarantees: pages render, navigation works on both viewports,
 * the admin area is closed, and consent gates tracking.
 */

async function acceptCookies(page: Page) {
  // The banner renders after hydration, so a plain isVisible() check races it —
  // and a missed click leaves consent undecided, which silently changes what
  // the rest of the page does.
  const accept = page.getByRole("button", { name: "Accepter alle" });
  try {
    await accept.waitFor({ state: "visible", timeout: 10_000 });
    await accept.click();
  } catch {
    // Already decided in this context — nothing to accept.
  }
}

const publicPages = [
  "/",
  "/privat",
  "/privat/bilforsikring",
  "/erhverv",
  "/erhverv/arbejdsskadeforsikring",
  "/brancher",
  "/brancher/haandvaerkere",
  "/guides",
  "/guides/hvad-betyder-selvrisiko",
  "/om",
  "/kontakt",
  "/book",
  "/cases",
  "/privatlivspolitik",
  "/cookiepolitik",
  "/vilkaar",
];

test.describe("public pages", () => {
  for (const path of publicPages) {
    test(`${path} renders with a title, one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/.+/);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute("content", /.{50,}/);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);

      expect(errors, `Console errors on ${path}: ${errors.join(" | ")}`).toHaveLength(0);
    });
  }
});

test.describe("navigation", () => {
  test("the primary CTA reaches the funnel from the home page", async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);

    await page
      .getByRole("link", { name: /forsikringstjek/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/forsikringstjek/);
  });

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile menu only exists on small viewports");

    await page.goto("/");
    await acceptCookies(page);

    await page.getByRole("button", { name: "Åbn menu" }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    await menu.getByRole("link", { name: "Erhverv", exact: true }).click();
    await expect(page).toHaveURL(/\/erhverv$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("the sticky mobile CTA appears after scrolling, not before", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "Sticky CTA is mobile-only");

    await page.goto("/");
    await acceptCookies(page);

    const sticky = page.getByRole("link", { name: "Start forsikringstjek" });
    await expect(sticky).toHaveCount(0);

    // Scroll programmatically: wheel events are unreliable under touch emulation.
    await page.evaluate(() => window.scrollTo(0, 1400));
    await expect(sticky).toBeVisible();
  });

  test("footer product links resolve", async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);

    const link = page.getByRole("contentinfo").getByRole("link", { name: "Cyberforsikring" });
    await link.click();
    await expect(page).toHaveURL(/\/erhverv\/cyberforsikring$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cyberforsikring");
  });

  test("an unknown URL shows the 404 page with a way forward", async ({ page }) => {
    const response = await page.goto("/denne-side-findes-ikke");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /Vi kunne ikke finde den side/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Til forsiden/ })).toBeVisible();
  });
});

test.describe("SEO plumbing", () => {
  test("sitemap lists the real content pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const xml = await response.text();
    expect(xml).toContain("/privat/bilforsikring");
    expect(xml).toContain("/erhverv/cyberforsikring");
    expect(xml).toContain("/brancher/haandvaerkere");
    expect(xml).toContain("/guides/hvad-er-underforsikring");
    // The funnel and campaign pages stay out of the index.
    expect(xml).not.toContain("/forsikringstjek");
    expect(xml).not.toContain("/lp/");
  });

  test("robots.txt closes the admin area and the API", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap:");
  });

  test("pages carry breadcrumb structured data", async ({ page }) => {
    await page.goto("/brancher/restauranter");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((block) => {
      const parsed = JSON.parse(block);
      return Array.isArray(parsed) ? parsed.map((p) => p["@type"]) : [parsed["@type"]];
    });
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("Organization");
  });
});

test.describe("admin is protected", () => {
  for (const path of ["/admin", "/admin/leads", "/admin/pipeline"]) {
    test(`${path} is not reachable without a session`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(page.getByRole("heading", { name: "Log ind" })).toBeVisible();
    });
  }

  test("admin pages are marked noindex", async ({ page }) => {
    const response = await page.goto("/admin/login");
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  });
});

test.describe("consent gates tracking", () => {
  test("no tracking script loads before a choice is made", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (/googletagmanager|google-analytics|facebook|clarity\.ms|licdn/.test(url)) {
        thirdParty.push(url);
      }
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Vi bruger cookies" })).toBeVisible();
    expect(thirdParty).toHaveLength(0);
  });

  test("the choice is remembered and the banner does not return", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Kun nødvendige" }).click();
    await expect(page.getByRole("heading", { name: "Vi bruger cookies" })).toHaveCount(0);

    await page.goto("/privat");
    await expect(page.getByRole("heading", { name: "Vi bruger cookies" })).toHaveCount(0);
  });

  test("the footer can reopen the choice", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Accepter alle" }).click();
    await page.getByRole("button", { name: "Cookieindstillinger" }).click();
    await expect(page.getByRole("heading", { name: "Vi bruger cookies" })).toBeVisible();
  });
});

test.describe("attribution", () => {
  test("campaign parameters are captured and sent with the lead", async ({ page }) => {
    let payload: Record<string, unknown> | null = null;

    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.route("**/api/leads", async (route) => {
      payload = JSON.parse(route.request().postData() ?? "{}");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, leadId: "00000000-0000-4000-8000-000000000000" }),
      });
    });

    await page.goto(
      "/?utm_source=google&utm_medium=cpc&utm_campaign=bil-2026&gclid=test-click-id",
    );
    await acceptCookies(page);

    // Navigate onwards — first-touch attribution must survive the journey.
    await page.goto("/forsikringstjek?type=privat");
    await page.getByRole("checkbox", { name: "Bil" }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();
    await page.getByRole("radio", { name: "Begge dele" }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();
    await page.getByLabel("Fornavn").fill("Anna");
    await page.getByLabel("Efternavn").fill("Jensen");
    await page.getByLabel("Telefon").fill("12345678");
    await page.getByLabel("E-mail").fill("anna@example.dk");
    await page.getByRole("button", { name: "Fortsæt" }).click();
    await page.getByRole("radio", { name: "Ring mig op" }).check();
    await page.getByRole("checkbox", { name: /samtykke/ }).check();
    await page.getByRole("button", { name: "Send mit forsikringstjek" }).click();

    await expect(page.getByRole("heading", { name: /Tak, Anna/ })).toBeVisible();

    const attribution = (payload as unknown as { attribution: Record<string, string> })
      .attribution;
    expect(attribution.utm_source).toBe("google");
    expect(attribution.utm_medium).toBe("cpc");
    expect(attribution.utm_campaign).toBe("bil-2026");
    expect(attribution.gclid).toBe("test-click-id");
    // First touch: the landing page, not the page the form was on.
    expect(attribution.landing_page).toBe("/");
  });
});
