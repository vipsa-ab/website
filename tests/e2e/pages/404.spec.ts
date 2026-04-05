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
    const nav = page.locator("header nav");
    await expect(nav).toBeVisible();
    const position = await nav.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("fixed");
  });

  test("header logo link navigates to home", async ({ page }) => {
    await page.locator('a[aria-label="Gå till startsidan"]').click();
    await expect(page).toHaveURL("/");
  });

  // The desktop CTA is hidden on mobile (md:inline-flex), so we only check
  // that it exists in the DOM. For mobile visibility see the mobile menu tests.
  test("header booking CTA exists and links to /booking", async ({ page }) => {
    const cta = page.locator('header a[href="/booking"]');
    await expect(cta).toBeAttached();
    await expect(cta).toHaveText("Boka Nu");
  });

  test("desktop: header booking CTA is visible on wide viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('header a[href="/booking"]')).toBeVisible();
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

  // ── Mobile menu ────────────────────────────────────────────────────────

  test("mobile: hamburger button is visible on narrow viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const hamburger = page.locator(
      'button[aria-label="Öppna navigationsmeny"]',
    );
    await expect(hamburger).toBeVisible();
  });

  test("mobile: clicking hamburger opens the navigation drawer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('button[aria-label="Öppna navigationsmeny"]').click();
    const drawer = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(drawer).toBeVisible();
  });

  test("mobile: drawer contains Boka Nu CTA", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('button[aria-label="Öppna navigationsmeny"]').click();
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.locator('a[href="/booking"]')).toBeVisible();
  });

  test("mobile: close button inside drawer closes the menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const trigger = page.locator('button[aria-label="Öppna navigationsmeny"]');
    await trigger.click();
    await page
      .locator('button[aria-label="Stäng navigationsmeny"]')
      .dispatchEvent("click");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.locator('[role="dialog"][aria-modal="true"]'),
    ).not.toBeInViewport();
  });

  test("mobile: Escape key closes the drawer", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const trigger = page.locator('button[aria-label="Öppna navigationsmeny"]');
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.locator('[role="dialog"][aria-modal="true"]'),
    ).not.toBeInViewport();
  });
});
