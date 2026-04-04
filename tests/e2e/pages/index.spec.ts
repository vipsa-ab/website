import { test, expect } from "@playwright/test";

test.describe("Index Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ── Document metadata ──────────────────────────────────────────────────

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle("Vipsa | Samma städare. Varje gång.");
  });

  test("has correct meta description", async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute(
      "content",
      /Professionell städning i Stockholm/,
    );
  });

  test("has lang=sv on <html>", async ({ page }) => {
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("sv");
  });

  // ── Header ─────────────────────────────────────────────────────────────

  test("header is visible and sticky at the top", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    const position = await nav.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("fixed");
  });

  test("header logo link navigates to home", async ({ page }) => {
    await page.locator('a[aria-label="Gå till startsidan"]').click();
    await expect(page).toHaveURL("/");
  });

  test("header nav contains all main page links", async ({ page }) => {
    await expect(page.locator('nav a[href="/"]').first()).toBeAttached();
    await expect(page.locator('nav a[href="/services"]')).toBeAttached();
    await expect(page.locator('nav a[href="/about"]')).toBeAttached();
    await expect(page.locator('nav a[href="/pricing"]')).toBeAttached();
    await expect(page.locator('nav a[href="/contact"]')).toBeAttached();
  });

  test("header booking CTA is visible and links to /booking", async ({
    page,
  }) => {
    const cta = page.locator('header a[href="/booking"]');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText("Boka Nu");
  });

  // ── Hero Section ───────────────────────────────────────────────────────

  test("hero section renders the main h1", async ({ page }) => {
    const h1 = page.locator("main h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Ett renare hem,");
  });

  test("hero section renders primary CTA button", async ({ page }) => {
    const cta = page.locator("main button", { hasText: "Boka städning" });
    await expect(cta).toBeVisible();
  });

  test("hero section renders secondary CTA button", async ({ page }) => {
    const cta = page.locator("main button", { hasText: "Våra tjänster" });
    await expect(cta).toBeVisible();
  });

  test("hero section renders the guarantee card", async ({ page }) => {
    await expect(page.locator("main")).toContainText("100% Nöjd-kund-garanti");
  });

  // ── Service Section ────────────────────────────────────────────────────

  test("service section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Våra Tjänster" }),
    ).toBeVisible();
  });

  test("service section shows all three service cards", async ({ page }) => {
    await expect(page.locator("h3", { hasText: "Hemstädning" })).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Flyttstädning" }),
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Kontorsstädning" }),
    ).toBeVisible();
  });

  // ── How It Works Section ───────────────────────────────────────────────

  test("how it works section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Hur det fungerar" }),
    ).toBeVisible();
  });

  test("how it works section shows all three steps", async ({ page }) => {
    await expect(page.locator("h3", { hasText: "1. Boka" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "2. Vi städar" })).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "3. Njut av renheten" }),
    ).toBeVisible();
  });

  // ── About Section ──────────────────────────────────────────────────────

  test("about section heading is visible", async ({ page }) => {
    await expect(page.locator("h2", { hasText: "Om Vipsa" })).toBeVisible();
  });

  test("about section shows stats", async ({ page }) => {
    await expect(page.locator("main")).toContainText("500+");
    await expect(page.locator("main")).toContainText("10k+");
  });

  // ── Testimonials Section ───────────────────────────────────────────────

  test("testimonials section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Vad våra kunder säger" }),
    ).toBeVisible();
  });

  test("testimonials section shows three customer reviews", async ({
    page,
  }) => {
    await expect(
      page.locator("*", { hasText: "Anna Svensson" }).last(),
    ).toBeVisible();
    await expect(
      page.locator("*", { hasText: "Erik Johansson" }).last(),
    ).toBeVisible();
    await expect(
      page.locator("*", { hasText: "Maria Andersson" }).last(),
    ).toBeVisible();
  });

  // ── Footer ─────────────────────────────────────────────────────────────

  test("footer is visible at the bottom of the page", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer")).toBeVisible();
  });

  test("footer shows brand description", async ({ page }) => {
    await expect(page.locator("footer")).toContainText(
      "Din lokala partner för ett renare hem och en enklare vardag i Sigtuna.",
    );
  });

  test("footer shows contact info", async ({ page }) => {
    await expect(page.locator("footer")).toContainText("info@vipsa.se");
    await expect(page.locator("footer")).toContainText("08-123 45 67");
  });

  test("footer shows copyright notice", async ({ page }) => {
    await expect(page.locator("footer")).toContainText(
      "© 2024 LaganStäd AB. All rights reserved.",
    );
  });

  test("footer privacy policy link is present", async ({ page }) => {
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });

  test("footer terms link is present", async ({ page }) => {
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  });

  test("footer Facebook link opens externally", async ({ page }) => {
    const fbLink = page.locator(
      'footer a[href="https://www.facebook.com/vipsa"]',
    );
    await expect(fbLink).toHaveAttribute("target", "_blank");
    await expect(fbLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("footer Instagram link opens externally", async ({ page }) => {
    const igLink = page.locator(
      'footer a[href="https://www.instagram.com/vipsa"]',
    );
    await expect(igLink).toHaveAttribute("target", "_blank");
    await expect(igLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  // ── Responsive: mobile nav hidden ─────────────────────────────────────

  test("desktop nav links are hidden on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const navGroup = page.locator("nav .md\\:flex");
    await expect(navGroup).toBeHidden();
  });

  test("desktop nav links are visible on md+ viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const navGroup = page.locator("nav .md\\:flex");
    await expect(navGroup).toBeVisible();
  });
});
