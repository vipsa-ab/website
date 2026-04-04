import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
  });

  // ── Document metadata ──────────────────────────────────────────────────

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle("Vipsa | 404 | Sidan kunde inte hittas");
  });

  test("has correct meta description", async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute(
      "content",
      /Den sida du letar efter kunde inte hittas/,
    );
  });

  // ── Header ─────────────────────────────────────────────────────────────

  test("header is present and sticky", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    const position = await nav.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("fixed");
  });

  test("header logo link navigates to home", async ({ page }) => {
    await page.locator('a[aria-label="Gå till startsidan"]').click();
    await expect(page).toHaveURL("/");
  });

  test("header booking CTA is visible", async ({ page }) => {
    const cta = page.locator('header a[href="/booking"]');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText("Boka Nu");
  });

  // ── 404 content ────────────────────────────────────────────────────────

  test("displays 404 text", async ({ page }) => {
    await expect(page.locator("main")).toContainText("404");
  });

  test("displays the main h1 heading", async ({ page }) => {
    const h1 = page.locator("main h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Hoppsan! Sidan verkar ha tagit ledigt.");
  });

  test("displays the description paragraph", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Precis som ett nystädat hem",
    );
  });

  test("home CTA button is visible and links to /", async ({ page }) => {
    const homeLink = page.locator('main a[href="/"]');
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toContainText("Gå till startsidan");
  });

  test("contact CTA button is visible and links to /contact", async ({
    page,
  }) => {
    const contactLink = page.locator('main a[href="/contact"]');
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toContainText("Kontakta oss");
  });

  test("home CTA navigates to index page", async ({ page }) => {
    await page.locator('main a[href="/"]').click();
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle("Vipsa | Samma städare. Varje gång.");
  });

  // ── Suggestion cards ───────────────────────────────────────────────────

  test("shows all three suggestion cards", async ({ page }) => {
    await expect(
      page.locator("h3", { hasText: "Våra Tjänster" }),
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Boka Städning" }),
    ).toBeVisible();
    await expect(page.locator("h3", { hasText: "Städguiden" })).toBeVisible();
  });

  // ── Footer ─────────────────────────────────────────────────────────────

  test("footer is visible at the bottom", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer")).toBeVisible();
  });

  test("footer shows copyright notice", async ({ page }) => {
    await expect(page.locator("footer")).toContainText(
      "© 2024 LaganStäd AB. All rights reserved.",
    );
  });

  test("footer quick links are present", async ({ page }) => {
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  });

  // ── Navigation flow ────────────────────────────────────────────────────

  test("navigating to a bad URL and back to home works", async ({ page }) => {
    await expect(page.locator("main h1")).toContainText("Hoppsan!");
    await page.locator('main a[href="/"]').click();
    await expect(page).toHaveURL("/");
  });

  // ── Responsive ────────────────────────────────────────────────────────

  test("page content is readable on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('main a[href="/"]')).toBeVisible();
  });
});
