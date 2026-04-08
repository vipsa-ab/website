import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  // ── Document metadata ──────────────────────────────────────────────────

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle("Om Vipsa | Samma städare. Varje gång.");
  });

  test("has correct meta description", async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute(
      "content",
      /Lär känna Vipsa — din pålitliga partner/,
    );
  });

  test("has lang=sv on <html>", async ({ page }) => {
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("sv");
  });

  // ── Header ─────────────────────────────────────────────────────────────

  test("header is visible and sticky at the top", async ({ page }) => {
    const nav = page.locator("header nav");
    await expect(nav).toBeVisible();
    const position = await nav.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("fixed");
  });

  test("header logo link navigates to home", async ({ page }) => {
    await page.locator('a[aria-label="Gå till startsidan"]').click();
    await expect(page).toHaveURL("/");
  });

  test("header nav contains all main page links", async ({ page }) => {
    await expect(page.locator('header a[href="/"]').first()).toBeAttached();
    await expect(page.locator('header a[href="/services"]')).toBeAttached();
    await expect(page.locator('header a[href="/about"]')).toBeAttached();
    await expect(page.locator('header a[href="/pricing"]')).toBeAttached();
    await expect(page.locator('header a[href="/contact"]')).toBeAttached();
  });

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

  // ── Hero Section ───────────────────────────────────────────────────────

  test("hero section renders the label text", async ({ page }) => {
    await expect(page.locator("main")).toContainText("Om Vipsa");
  });

  test("hero section renders the main h1", async ({ page }) => {
    const h1 = page.locator("main h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Din partner för ett");
    await expect(h1).toContainText("renare hem");
  });

  test("hero section renders the description", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Vi skapar utrymme för livet",
    );
  });

  test("hero section renders the background image", async ({ page }) => {
    const img = page.locator('img[alt="Clean Nordic Living Room"]');
    await expect(img).toBeAttached();
  });

  test("hero image loads eagerly", async ({ page }) => {
    const img = page.locator('img[alt="Clean Nordic Living Room"]');
    await expect(img).toHaveAttribute("loading", "eager");
  });

  // ── Story Section ─────────────────────────────────────────────────────

  test("story section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Vår Berättelse" }),
    ).toBeVisible();
  });

  test("story section renders the founding narrative", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Vipsa föddes ur en enkel vision",
    );
  });

  test("story section renders the Lagom reference", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Våra rötter sträcker sig djupt",
    );
    const strong = page.locator("main strong", { hasText: "Lagom" });
    await expect(strong).toBeVisible();
  });

  test("story section renders the team image", async ({ page }) => {
    const img = page.locator('img[alt="Sigtuna Team"]');
    await expect(img).toBeAttached();
  });

  test("story section renders the established year badge", async ({ page }) => {
    await expect(page.locator("main")).toContainText("Etablerat 2018");
  });

  // ── Values Section ────────────────────────────────────────────────────

  test("values section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Våra Värderingar" }),
    ).toBeVisible();
  });

  test("values section shows all three value cards", async ({ page }) => {
    await expect(page.locator("h3", { hasText: "Kvalitet" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Hållbarhet" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Pålitlighet" })).toBeVisible();
  });

  test("values section shows value descriptions", async ({ page }) => {
    await expect(page.locator("main")).toContainText("Vi nöjer oss inte med");
    await expect(page.locator("main")).toContainText("Svanenmärkta produkter");
    await expect(page.locator("main")).toContainText(
      "Samma personal, samma tid, samma höga standard",
    );
  });

  // ── Team Section ──────────────────────────────────────────────────────

  test("team section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Möt Vårt Team" }),
    ).toBeVisible();
  });

  test("team section shows the subtitle", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Människorna bakom glansen i ditt hem",
    );
  });

  test("team section renders all four team members", async ({ page }) => {
    await expect(
      page.locator("h4", { hasText: "Elin Karlsson" }),
    ).toBeVisible();
    await expect(
      page.locator("h4", { hasText: "Johan Lindberg" }),
    ).toBeVisible();
    await expect(
      page.locator("h4", { hasText: "Sara Andersson" }),
    ).toBeVisible();
    await expect(page.locator("h4", { hasText: "Markus Berg" })).toBeVisible();
  });

  test("team section shows member roles", async ({ page }) => {
    await expect(page.locator("main")).toContainText("Teamledare");
    await expect(page.locator("main")).toContainText("Fönsterspecialist");
    await expect(page.locator("main")).toContainText("Hållbarhetskoordinator");
    await expect(page.locator("main")).toContainText("Driftchef");
  });

  // ── CTA Section ────────────────────────────────────────────────────────

  test("CTA section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Vill du bli en del av vårt team?" }),
    ).toBeVisible();
  });

  test("CTA section description is visible", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Vi letar alltid efter passionerade människor",
    );
  });

  test("CTA section jobs link is visible and correct", async ({ page }) => {
    const link = page.locator('main a[href="/services"]', {
      hasText: "Lediga tjänster",
    });
    await expect(link).toBeVisible();
  });

  test("CTA section booking link is visible and correct", async ({ page }) => {
    const link = page.locator('main a[href="/booking"]', {
      hasText: "Boka städning",
    });
    await expect(link).toBeVisible();
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
      `© ${new Date().getFullYear()} Vipsa AB. All rights reserved.`,
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

  // ── Section ordering (scroll position) ────────────────────────────────

  test("sections appear in correct visual order", async ({ page }) => {
    const heroY = await page
      .locator("h1", { hasText: "Din partner för ett" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const storyY = await page
      .locator("h2", { hasText: "Vår Berättelse" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const valuesY = await page
      .locator("h2", { hasText: "Våra Värderingar" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const teamY = await page
      .locator("h2", { hasText: "Möt Vårt Team" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const ctaY = await page
      .locator("h2", { hasText: "Vill du bli en del av vårt team?" })
      .evaluate((el) => el.getBoundingClientRect().top);

    expect(heroY).toBeLessThan(storyY);
    expect(storyY).toBeLessThan(valuesY);
    expect(valuesY).toBeLessThan(teamY);
    expect(teamY).toBeLessThan(ctaY);
  });

  // ── Navigation flows ──────────────────────────────────────────────────

  test("CTA jobs link navigates to /services", async ({ page }) => {
    await page
      .locator('main a[href="/services"]', { hasText: "Lediga tjänster" })
      .click();
    await expect(page).toHaveURL("/services");
  });

  test("CTA booking link navigates to /booking", async ({ page }) => {
    await page
      .locator('main a[href="/booking"]', { hasText: "Boka städning" })
      .click();
    await expect(page).toHaveURL("/booking");
  });

  // ── Responsive: desktop nav ────────────────────────────────────────────

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

  test("mobile: hamburger button is hidden on desktop viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const hamburger = page.locator(
      'button[aria-label="Öppna navigationsmeny"]',
    );
    await expect(hamburger).toBeHidden();
  });

  test("mobile: clicking hamburger opens the navigation drawer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('button[aria-label="Öppna navigationsmeny"]').click();
    const drawer = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(drawer).toBeVisible();
  });

  test("mobile: drawer contains all navigation links", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('button[aria-label="Öppna navigationsmeny"]').click();
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer.locator('a[href="/"]')).toBeVisible();
    await expect(drawer.locator('a[href="/services"]')).toBeVisible();
    await expect(drawer.locator('a[href="/about"]')).toBeVisible();
    await expect(drawer.locator('a[href="/pricing"]')).toBeVisible();
    await expect(drawer.locator('a[href="/contact"]')).toBeVisible();
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

  // ── Responsive: page content ──────────────────────────────────────────

  test("page content is readable on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("h3", { hasText: "Kvalitet" })).toBeVisible();
  });
});
