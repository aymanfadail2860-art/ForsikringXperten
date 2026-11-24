import { expect, test, type Page } from "@playwright/test";

/**
 * The lead funnel is the product. These tests cover the path that has to work
 * on every device, every time: start → complete → confirmation.
 *
 * The intake API is intercepted so the suite runs without a database. What is
 * asserted is the request the browser actually sends — which is the contract
 * the server validates against.
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

test.describe("forsikringstjek", () => {
  test("a visitor can complete the private flow", async ({ page }) => {
    const requests: Record<string, unknown>[] = [];

    await page.route("**/api/leads", async (route) => {
      requests.push(JSON.parse(route.request().postData() ?? "{}"));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, leadId: "00000000-0000-4000-8000-000000000000" }),
      });
    });
    // Funnel progress events are fire-and-forget; swallow them.
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));

    await page.goto("/forsikringstjek");
    await acceptCookies(page);

    // Step 1 — segment
    await expect(
      page.getByRole("heading", { name: "Hvad vil du have gennemgået?" }),
    ).toBeVisible();
    await page.getByRole("radio", { name: /Mine private forsikringer/ }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();

    // Step 2 — products
    await expect(page.getByRole("heading", { name: /Hvilke forsikringer/ })).toBeVisible();
    await page.getByRole("checkbox", { name: "Bil" }).check();
    await page.getByRole("checkbox", { name: "Indbo" }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();

    // Step 3 — goal
    await page.getByRole("radio", { name: "Begge dele" }).check();
    await page.getByLabel(/Hvilket selskab er du hos i dag/).fill("Et Selskab");
    await page.getByRole("button", { name: "Fortsæt" }).click();

    // Step 4 — contact details
    await page.getByLabel("Fornavn").fill("Anna");
    await page.getByLabel("Efternavn").fill("Jensen");
    await page.getByLabel("Telefon").fill("12 34 56 78");
    await page.getByLabel("E-mail").fill("anna.jensen@example.dk");
    await page.getByRole("button", { name: "Fortsæt" }).click();

    // Step 5 — contact preference and consent
    await page.getByRole("radio", { name: "Ring mig op" }).check();
    await page.getByRole("checkbox", { name: /samtykke/ }).check();
    await page.getByRole("button", { name: "Send mit forsikringstjek" }).click();

    // Confirmation
    await expect(page.getByRole("heading", { name: /Tak, Anna/ })).toBeVisible();

    expect(requests).toHaveLength(1);
    const payload = requests[0] as Record<string, unknown>;
    expect(payload.leadType).toBe("privat");
    expect(payload.selectedProducts).toEqual(["bilforsikring", "indboforsikring"]);
    expect(payload.primaryGoal).toBe("begge");
    expect(payload.preferredContact).toBe("ring");
    expect(payload.consent).toBe(true);
    // The honeypot must be sent empty by a real user.
    expect(payload.website).toBe("");
  });

  test("the front page asks step one and carries the answer into the funnel", async ({
    page,
  }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/");
    await acceptCookies(page);

    // Step one is answerable without leaving the front page.
    await expect(
      page.getByRole("heading", { name: "Hvad vil du have gennemgået?" }),
    ).toBeVisible();

    await page.getByRole("link", { name: /Mine private forsikringer/ }).click();

    // …and the funnel opens on step two, not back at the start.
    await expect(page).toHaveURL(/\/forsikringstjek\?type=privat/);
    await expect(page.getByText("Trin 2 af 5")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Hvilke forsikringer/ })).toBeVisible();
  });

  test("the business entry lands in the business flow", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/");
    await acceptCookies(page);

    await page.getByRole("link", { name: /Min virksomheds forsikringer/ }).click();
    await expect(page).toHaveURL(/\/forsikringstjek\?type=erhverv/);
    await expect(
      page.getByRole("heading", { name: "Hvilken virksomhed drejer det sig om?" }),
    ).toBeVisible();
  });

  test("the offer-review entry reframes the funnel without changing the questions", async ({
    page,
  }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/");
    await acceptCookies(page);

    await page.getByRole("link", { name: /Jeg har fået et tilbud/ }).click();
    await expect(page).toHaveURL(/intent=tilbud/);
    await expect(
      page.getByRole("heading", { level: 1, name: /tilbuddet set efter/i }),
    ).toBeVisible();
    // Same first question as every other entry.
    await expect(
      page.getByRole("heading", { name: "Hvad vil du have gennemgået?" }),
    ).toBeVisible();
  });

  test("what happens after submitting is visible before submitting", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/forsikringstjek");
    await acceptCookies(page);

    await expect(page.getByRole("heading", { name: "Når du har sendt" })).toBeVisible();
    await expect(page.getByText(/beslutter selv resten/)).toBeVisible();
  });

  test("a segment link skips the first question", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/forsikringstjek?type=erhverv");
    await acceptCookies(page);

    await expect(
      page.getByRole("heading", { name: "Hvilken virksomhed drejer det sig om?" }),
    ).toBeVisible();
    await expect(page.getByText("Trin 2 af 7")).toBeVisible();
  });

  test("validation blocks an incomplete step and explains why", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/forsikringstjek");
    await acceptCookies(page);

    await page.getByRole("button", { name: "Fortsæt" }).click();
    await expect(page.getByText("Vælg en af mulighederne")).toBeVisible();

    await page.getByRole("radio", { name: /Mine private forsikringer/ }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();
    await page.getByRole("checkbox", { name: "Bil" }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();
    await page.getByRole("radio", { name: "Begge dele" }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();

    // Bad phone and email must be caught before anything is sent.
    await page.getByLabel("Fornavn").fill("Anna");
    await page.getByLabel("Efternavn").fill("Jensen");
    await page.getByLabel("Telefon").fill("123");
    await page.getByLabel("E-mail").fill("ikke-en-email");
    await page.getByRole("button", { name: "Fortsæt" }).click();

    await expect(page.getByText("Et dansk telefonnummer er 8 cifre")).toBeVisible();
    await expect(page.getByText("Tjek lige e-mailadressen")).toBeVisible();
    // Nothing the user typed is lost.
    await expect(page.getByLabel("Fornavn")).toHaveValue("Anna");
  });

  test("a failed submission keeps every answer", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "Noget gik galt hos os. Prøv igen om lidt." }),
      }),
    );

    await page.goto("/forsikringstjek?type=privat");
    await acceptCookies(page);

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

    await expect(page.getByText("Det gik ikke igennem")).toBeVisible();
    // Still on the last step, with the answers intact.
    await expect(page.getByRole("radio", { name: "Ring mig op" })).toBeChecked();
    await expect(
      page.getByRole("button", { name: "Send mit forsikringstjek" }),
    ).toBeEnabled();
  });

  test("answers survive a page reload", async ({ page }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/forsikringstjek?type=privat");
    await acceptCookies(page);

    await page.getByRole("checkbox", { name: "Bil" }).check();
    await page.getByRole("button", { name: "Fortsæt" }).click();
    await expect(page.getByRole("heading", { name: /Hvad er vigtigst/ })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { name: /Hvad er vigtigst/ })).toBeVisible();
  });

  test("the campaign landing page carries the funnel with the segment preset", async ({
    page,
  }) => {
    await page.route("**/api/funnel-events", (route) => route.fulfill({ status: 204 }));
    await page.goto("/lp/haandvaerker");
    await acceptCookies(page);

    await expect(
      page.getByRole("heading", { name: /håndværksvirksomhedens forsikringer/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hvilken virksomhed drejer det sig om?" }),
    ).toBeVisible();
  });
});
