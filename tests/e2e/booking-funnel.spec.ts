import { test, expect } from "@playwright/test";

test.describe("Booking funnel — desktop", () => {
  test("user discovers services from homepage and reaches booking", async ({
    page,
  }) => {
    await page.goto("/");

    // User sees the hero and clicks the primary booking CTA
    const bookingCta = page.getByRole("main").getByRole("link", {
      name: /boka/i,
    });
    await bookingCta.first().click();

    await expect(page).toHaveURL(/\/booking/);
  });

  test("user explores services page and reaches booking from CTA", async ({
    page,
  }) => {
    await page.goto("/services");

    // User scrolls through services and clicks a booking CTA
    const bookingLinks = page
      .getByRole("main")
      .getByRole("link", { name: /boka/i });
    await bookingLinks.last().click();

    await expect(page).toHaveURL(/\/booking/);
  });

  test("user navigates from homepage to services via header nav", async ({
    page,
    viewport,
  }) => {
    // Desktop nav links are hidden on mobile — skip for mobile projects
    test.skip(
      (viewport?.width ?? 1280) < 768,
      "Desktop header nav is hidden on mobile viewports",
    );

    await page.goto("/");

    // User clicks "Tjänster" in the header navigation
    await page
      .getByRole("banner")
      .getByRole("link", { name: /tjänster/i })
      .click();

    await expect(page).toHaveURL(/\/services/);

    // Verify they arrived at a page with content (not a blank/error page)
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });

  test("user navigates from services pricing CTA to pricing page", async ({
    page,
  }) => {
    await page.goto("/services");

    const pricingLink = page
      .getByRole("main")
      .getByRole("link", { name: /pris/i });
    await pricingLink.first().click();

    await expect(page).toHaveURL(/\/pricing/);
  });
});
