import { test, expect } from "@playwright/test";

test.describe("404 error recovery", () => {
  test("user hits a broken URL and navigates back to the homepage", async ({
    page,
  }) => {
    await page.goto("/this-page-does-not-exist");

    // User sees they're on an error page (title contains 404)
    await expect(page).toHaveTitle(/404/);

    // User sees a heading communicating the problem
    await expect(page.getByRole("main").locator("h1")).toBeVisible();

    // User clicks the recovery link to go home
    await page.getByRole("main").getByRole("link", { name: /startsidan/i }).click();

    // User successfully reaches the homepage
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });

  test("user hits a broken URL and reaches contact page for help", async ({
    page,
  }) => {
    await page.goto("/non-existent-page");

    // User clicks the contact link for help
    await page
      .getByRole("main")
      .getByRole("link", { name: /kontakt/i })
      .click();

    await expect(page).toHaveURL(/\/contact/);
  });
});
