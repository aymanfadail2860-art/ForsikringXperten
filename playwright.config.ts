import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * E2E runs against a production build — the funnel behaves differently in dev
 * (double-invoked effects, no static optimisation), and it is the production
 * behaviour we care about.
 *
 * Chromium is used for the desktop project and a mobile viewport for the
 * second, because most paid traffic arrives on a phone.
 */
/**
 * Some environments ship a preinstalled Chromium whose build number does not
 * match the one this Playwright version downloads. Point at it explicitly when
 * PLAYWRIGHT_CHROMIUM_PATH is set; otherwise use Playwright's own browser.
 */
const chromiumOverride = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
  : {};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "da-DK",
    timezoneId: "Europe/Copenhagen",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...chromiumOverride } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...chromiumOverride } },
  ],
  webServer: {
    command: `npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
