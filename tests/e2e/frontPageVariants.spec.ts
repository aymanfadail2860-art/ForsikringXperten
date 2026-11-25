import { expect, test, type Page } from "@playwright/test";

/**
 * The front page ships in two hero versions behind separate URLs, so one
 * change — the advisor's note next to the marked amount — can be judged on
 * its own. These tests hold the two versions identical in everything else,
 * which is the only way the comparison means anything.
 *
 * They also cover the handover between the page's own green button and the
 * sticky bottom bar, which is a timing behaviour and therefore exactly the
 * kind of thing that regresses silently.
 */

async function acceptCookies(page: Page) {
  const accept = page.getByRole("button", { name: "Accepter alle" });
  try {
    await accept.waitFor({ state: "visible", timeout: 10_000 });
    await accept.click();
  } catch {
    // Already decided in this context.
  }
}

const VARIANTS = [
  { path: "/", note: "Kan du betale 8.000 kr. i morgen?" },
  { path: "/forside-b", note: "En dækket skade koster 20.000 kr." },
] as const;

test.describe("hero versions", () => {
  for (const variant of VARIANTS) {
    test(`${variant.path} keeps headline, amount and both entries`, async ({ page }) => {
      await page.goto(variant.path);
      await acceptCookies(page);

      await expect(
        page.getByRole("heading", { level: 1, name: /Der står noget i din police/ }),
      ).toBeVisible();
      // The marked line is the whole idea — it must be on screen, not below it.
      await expect(page.getByText("Selvrisiko pr. skade: 8.000 kr.")).toBeInViewport();
      await expect(page.getByText("Eksempel", { exact: false }).first()).toBeVisible();

      await expect(page.getByText(variant.note)).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Sammenlign mine forsikringer/ }).first(),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /Få et modbud til mit firma/ }).first(),
      ).toBeVisible();
    });
  }

  test("each version shows only its own note", async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);
    await expect(page.getByText(VARIANTS[1].note)).toHaveCount(0);

    await page.goto("/forside-b");
    await expect(page.getByText(VARIANTS[0].note)).toHaveCount(0);
  });

  test("the note sits directly under the marked amount", async ({ page }) => {
    await page.goto("/forside-b");
    await acceptCookies(page);

    const amount = page.getByText("Selvrisiko pr. skade: 8.000 kr.");
    const note = page.getByText(VARIANTS[1].note);
    const amountBox = await amount.boundingBox();
    const noteBox = await note.boundingBox();
    expect(amountBox).not.toBeNull();
    expect(noteBox).not.toBeNull();
    // Below it, and close enough that no explanation is needed to link them.
    const gap = noteBox!.y - (amountBox!.y + amountBox!.height);
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThan(40);
  });

  test("the b-version is kept out of the index", async ({ page }) => {
    const response = await page.goto("/forside-b");
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });

  test("both entries work from the b-version too", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/forside-b");
    await acceptCookies(page);

    await page.getByRole("link", { name: /Få et modbud til mit firma/ }).first().click();
    await expect(page).toHaveURL(/\/forsikringstjek\?type=erhverv/);
    await expect(
      page.getByRole("heading", { name: "Hvilken virksomhed drejer det sig om?" }),
    ).toBeVisible();

    await page.goto("/forside-b");
    await page.getByRole("link", { name: /Sammenlign mine forsikringer/ }).first().click();
    await expect(page).toHaveURL(/\/forsikringstjek\?type=privat/);
    await expect(page.getByRole("heading", { name: /Hvilke forsikringer/ })).toBeVisible();
  });
});

test.describe("sticky bar hands over to the page's own button", () => {
  // The bar is mobile-only; on desktop it never renders.
  test.skip(({ isMobile }) => !isMobile, "mobile behaviour");

  const bar = (page: Page) => page.locator("[data-sticky-cta]");

  test("it appears after the hero and withdraws at the segment panel", async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);

    // Nothing at the top of the page: the visitor has not read anything yet.
    await expect(bar(page)).toHaveCount(0);

    // Past the hero, it is the only way back into the funnel.
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
    await expect(bar(page)).toBeVisible();
    await expect(bar(page)).not.toHaveAttribute("data-yielding", "");

    // At the segment panel, the panel's own green button takes over.
    const panelCta = page.getByRole("link", { name: /Få et modbud til mit firma/ }).last();
    await panelCta.scrollIntoViewIfNeeded();
    await expect(bar(page)).toHaveAttribute("data-yielding", "");
    await expect(bar(page)).not.toBeInViewport();
    await expect(panelCta).toBeInViewport();

    // And it comes back once the panel is behind us and no page button is left.
    await page.getByRole("heading", { name: /Spørgsmål/i }).first().scrollIntoViewIfNeeded();
    await expect(bar(page)).not.toHaveAttribute("data-yielding", "");
    await expect(bar(page)).toBeInViewport();
  });

  test("scrolling slowly in both directions never shows two green buttons", async ({
    page,
  }) => {
    await page.goto("/");
    await acceptCookies(page);

    const panelCta = page.getByRole("link", { name: /Sammenlign mine forsikringer/ }).last();
    const target = (await panelCta.evaluate((el) => el.getBoundingClientRect().top)) +
      (await page.evaluate(() => window.scrollY));

    const check = async () => {
      const yielding = (await bar(page).count()) === 0 ||
        (await bar(page).getAttribute("data-yielding")) !== null;
      const ctaVisible = await panelCta.isVisible() &&
        (await panelCta.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight;
        }));
      // The invariant: a visible panel button means no bottom bar.
      if (ctaVisible) expect(yielding).toBe(true);
    };

    // Down through the handover, then back up through it.
    for (let y = target - 700; y <= target + 300; y += 60) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(90);
      await check();
    }
    for (let y = target + 300; y >= target - 700; y -= 60) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(90);
      await check();
    }
  });

  test("the bar never rests on the last footer links", async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expect(bar(page)).toBeVisible();

    const barBox = await bar(page).boundingBox();
    expect(barBox).not.toBeNull();
    const links = page.locator("footer a");
    for (let i = 0; i < (await links.count()); i += 1) {
      const box = await links.nth(i).boundingBox();
      if (!box) continue;
      // Only links currently on screen can be covered.
      if (box.y + box.height < 0 || box.y > barBox!.y + barBox!.height) continue;
      expect(box.y + box.height, `footer link ${i} sits under the bar`).toBeLessThanOrEqual(
        barBox!.y + 1,
      );
    }
  });
});
