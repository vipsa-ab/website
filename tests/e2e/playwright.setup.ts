import { test as base } from "@playwright/test";

export const test = base.extend({
  // Default baseURL already set in playwright.config.ts
});

test.beforeEach(async ({ page }) => {
  // Mock backend POST endpoints for contact and booking forms
  await page.route("**/contact", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
      return;
    }
    await route.continue();
  });

  await page.route("**/booking", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
      return;
    }
    await route.continue();
  });
});
