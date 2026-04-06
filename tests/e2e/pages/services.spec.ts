import { test, expect } from "@playwright/test";

test.describe("Services Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services");
  });

  // ── Document metadata ──────────────────────────────────────────────────

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle("Vipsa | Tjänster");
  });

  test("has correct meta description", async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute(
      "content",
      /Utforska våra professionella städtjänster i Stockholm/,
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
    await expect(page.locator("main")).toContainText(
      "Välkommen till en renare vardag",
    );
  });

  test("hero section renders the main h1", async ({ page }) => {
    const h1 = page.locator("main h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Våra Tjänster");
  });

  test("hero section renders the description", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Vi kombinerar den svenska enkelheten",
    );
  });

  test("hero section renders booking CTA", async ({ page }) => {
    const cta = page.locator(
      'main section[id="service-hero"] a[href="/booking"]',
      {
        hasText: "Boka städning",
      },
    );
    await expect(cta).toBeVisible();
  });

  test("hero section renders pricing CTA", async ({ page }) => {
    const cta = page.locator('main a[href="/pricing"]', {
      hasText: "Se priser",
    });
    await expect(cta).toBeVisible();
  });

  test("hero section renders the guarantee card", async ({ page }) => {
    await expect(page.locator("main")).toContainText("100% Nöjd-kund-garanti");
  });

  // ── Services Section ──────────────────────────────────────────────────

  test("services section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Skräddarsydda lösningar för alla behov" }),
    ).toBeVisible();
  });

  test("services section shows all four service cards", async ({ page }) => {
    await expect(
      page.locator("h3", { hasText: "Hemstädning" }).first(),
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Flyttstädning" }).first(),
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Kontorsstädning" }),
    ).toBeVisible();
    await expect(page.locator("h3", { hasText: "Fönsterputs" })).toBeVisible();
  });

  test("services section shows service features", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Valfri frekvens (vecka/månad)",
    );
    await expect(page.locator("main")).toContainText("Garanti på besiktning");
    await expect(page.locator("main")).toContainText(
      "Anpassat efter kontorstider",
    );
    await expect(page.locator("main")).toContainText(
      "RUT-avdrag för privatpersoner",
    );
  });

  // ── Pricing Section ───────────────────────────────────────────────────

  test("pricing section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Enkla och transparenta priser" }),
    ).toBeVisible();
  });

  test("pricing section shows RUT disclaimer", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Alla priser är efter 50% RUT-avdrag",
    );
  });

  test("pricing section shows all three tiers", async ({ page }) => {
    await expect(
      page.locator("h4", { hasText: "Hemstädning Bas" }),
    ).toBeVisible();
    await expect(
      page.locator("h4", { hasText: "Hemstädning Premium" }),
    ).toBeVisible();
    await expect(
      page.locator("h4", { hasText: "Flyttstädning" }),
    ).toBeVisible();
  });

  test("pricing section shows prices", async ({ page }) => {
    await expect(page.locator("main")).toContainText("195 kr");
    await expect(page.locator("main")).toContainText("225 kr");
    await expect(page.locator("main")).toContainText("fr. 1 490 kr");
  });

  test("pricing section shows the Mest Populär badge", async ({ page }) => {
    await expect(page.locator("main")).toContainText("Mest Populär");
  });

  test("pricing section shows CTA buttons", async ({ page }) => {
    await expect(page.locator("button", { hasText: "Välj Bas" })).toBeVisible();
    await expect(
      page.locator("button", { hasText: "Välj Premium" }),
    ).toBeVisible();
    await expect(
      page.locator("button", { hasText: "Få Offert" }),
    ).toBeVisible();
  });

  // ── FAQ Section ────────────────────────────────────────────────────────

  test("FAQ section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Vanliga frågor" }),
    ).toBeVisible();
  });

  test("FAQ section shows all four questions", async ({ page }) => {
    await expect(page.locator("main")).toContainText(
      "Ingår städmaterial i priset?",
    );
    await expect(page.locator("main")).toContainText("Är ni försäkrade?");
    await expect(page.locator("main")).toContainText(
      "Hur fungerar RUT-avdraget?",
    );
    await expect(page.locator("main")).toContainText(
      "Vad händer om jag inte är nöjd?",
    );
  });

  test("FAQ answers are hidden by default", async ({ page }) => {
    await expect(
      page.locator("p", {
        hasText: "Vi sköter all administration med Skatteverket",
      }),
    ).toBeHidden();
  });

  test("FAQ card expands when clicked to reveal the answer", async ({
    page,
  }) => {
    const question = page.locator("button", {
      hasText: "Hur fungerar RUT-avdraget?",
    });
    await question.scrollIntoViewIfNeeded();
    // Retry click until hydration completes and the answer appears
    const answer = page.locator("p", {
      hasText: "Vi sköter all administration med Skatteverket",
    });
    await expect(async () => {
      await question.click();
      await expect(answer).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });
  });

  test("FAQ card collapses when clicked again", async ({ page }) => {
    const question = page.locator("button", {
      hasText: "Hur fungerar RUT-avdraget?",
    });
    await question.scrollIntoViewIfNeeded();
    const answer = page.locator("p", {
      hasText: "Vi sköter all administration med Skatteverket",
    });
    await expect(async () => {
      await question.click();
      await expect(answer).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    await question.click();
    await expect(answer).toBeHidden();
  });

  test("multiple FAQ cards can be open simultaneously", async ({ page }) => {
    const firstQ = page.locator("button", {
      hasText: "Ingår städmaterial i priset?",
    });
    const firstA = page.locator("p", {
      hasText: "Vid hemstädning använder vi oftast kundens egna material",
    });
    await firstQ.scrollIntoViewIfNeeded();
    await expect(async () => {
      await firstQ.click();
      await expect(firstA).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    const secondQ = page.locator("button", {
      hasText: "Är ni försäkrade?",
    });
    const secondA = page.locator("p", {
      hasText: "Vi har en omfattande ansvarsförsäkring",
    });
    await expect(async () => {
      await secondQ.click();
      await expect(secondA).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    // First answer should still be visible
    await expect(firstA).toBeVisible();
  });

  // ── CTA Section ────────────────────────────────────────────────────────

  test("CTA section heading is visible", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Redo för en renare vardag?" }),
    ).toBeVisible();
  });

  test("CTA section booking link is visible and correct", async ({ page }) => {
    const cta = page.locator('main section[id="service-cta"] a', {
      hasText: "Boka städning",
    });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/booking");
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
      .locator("h1", { hasText: "Våra Tjänster" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const servicesY = await page
      .locator("h2", { hasText: "Skräddarsydda lösningar" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const pricingY = await page
      .locator("h2", { hasText: "Enkla och transparenta priser" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const faqY = await page
      .locator("h2", { hasText: "Vanliga frågor" })
      .evaluate((el) => el.getBoundingClientRect().top);
    const ctaY = await page
      .locator("h2", { hasText: "Redo för en renare vardag?" })
      .evaluate((el) => el.getBoundingClientRect().top);

    expect(heroY).toBeLessThan(servicesY);
    expect(servicesY).toBeLessThan(pricingY);
    expect(pricingY).toBeLessThan(faqY);
    expect(faqY).toBeLessThan(ctaY);
  });

  // ── Navigation flows ──────────────────────────────────────────────────

  test("hero booking CTA navigates to /booking", async ({ page }) => {
    await page
      .locator('main section[id="service-hero"] a[href="/booking"]', {
        hasText: "Boka städning",
      })
      .click();
    await expect(page).toHaveURL("/booking");
  });

  test("hero pricing CTA navigates to /pricing", async ({ page }) => {
    await page
      .locator('main a[href="/pricing"]', { hasText: "Se priser" })
      .click();
    await expect(page).toHaveURL("/pricing");
  });

  test("CTA section booking link navigates to /booking", async ({ page }) => {
    await page
      .locator('main section[id="service-cta"] a', {
        hasText: "Boka städning",
      })
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
    await expect(page.locator("button", { hasText: "Välj Bas" })).toBeVisible();
  });
});
