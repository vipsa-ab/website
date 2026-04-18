import { test, expect } from "@playwright/test";

const CANONICAL_SLUG = "home-cleaning";
const ADDITIONAL_SLUG = "windows-cleaning";

test.describe("Service detail — routing", () => {
  test("user clicks a service card on /services and lands on a detail page", async ({
    page,
  }) => {
    await page.goto("/services");

    const serviceLink = page
      .getByRole("main")
      .locator(`a[href="/services/${CANONICAL_SLUG}"]`)
      .first();
    await serviceLink.click();

    await expect(page).toHaveURL(new RegExp(`/services/${CANONICAL_SLUG}$`));
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });

  test("additional service card routes to its own detail page", async ({
    page,
  }) => {
    await page.goto("/services");

    const serviceLink = page
      .getByRole("main")
      .locator(`a[href="/services/${ADDITIONAL_SLUG}"]`)
      .first();
    await serviceLink.click();

    await expect(page).toHaveURL(new RegExp(`/services/${ADDITIONAL_SLUG}$`));
  });
});

test.describe("Service detail — breadcrumb navigation", () => {
  test("breadcrumb returns the user to the services listing", async ({
    page,
  }) => {
    await page.goto(`/services/${CANONICAL_SLUG}`);

    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
    await breadcrumb.getByRole("link", { name: /tjänster/i }).click();

    await expect(page).toHaveURL(/\/services\/?$/);
  });

  test("breadcrumb returns the user to the homepage", async ({ page }) => {
    await page.goto(`/services/${CANONICAL_SLUG}`);

    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
    await breadcrumb.getByRole("link", { name: /hem/i }).first().click();

    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Service detail — booking flow", () => {
  test("user reaches booking from the hero CTA", async ({ page }) => {
    await page.goto(`/services/${CANONICAL_SLUG}`);

    // Click the first booking entry point on the page (hero CTA)
    await page.getByRole("main").locator('a[href="/booking"]').first().click();

    await expect(page).toHaveURL(/\/booking/);
  });

  test("user reaches booking from the pricing-section CTA", async ({
    page,
  }) => {
    await page.goto(`/services/${CANONICAL_SLUG}`);

    await page.locator('section#pricing a[href="/booking"]').first().click();

    await expect(page).toHaveURL(/\/booking/);
  });
});

test.describe("Service detail — page composition", () => {
  test("all required landmarks and sections are present", async ({ page }) => {
    await page.goto(`/services/${CANONICAL_SLUG}`);

    await expect(page.getByRole("banner")).toBeAttached();
    await expect(page.getByRole("contentinfo")).toBeAttached();
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
    await expect(page.locator("section#included")).toBeAttached();
    await expect(page.locator("section#excluded")).toBeAttached();
    await expect(page.locator("section#pricing")).toBeAttached();
  });
});
