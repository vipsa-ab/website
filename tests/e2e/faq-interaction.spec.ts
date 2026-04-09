import { test, expect } from "@playwright/test";

test.describe("FAQ interaction — post-hydration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services");
  });

  test("user expands a FAQ question and sees the answer", async ({ page }) => {
    // FAQ cards use client:visible — scroll them into view to trigger hydration
    const faqSection = page.locator("section", {
      has: page.getByRole("button", { name: /\?/ }),
    });
    await faqSection.scrollIntoViewIfNeeded();

    const firstFaqButton = page.getByRole("button", { name: /\?/ }).first();

    // Retry until hydration completes and click actually toggles state
    await expect(async () => {
      await firstFaqButton.click();
      // The answer paragraph appears as a sibling inside the same card
      const answer = firstFaqButton.locator(".. >> p");
      await expect(answer).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });
  });

  test("user can expand and then collapse a FAQ answer", async ({ page }) => {
    const faqSection = page.locator("section", {
      has: page.getByRole("button", { name: /\?/ }),
    });
    await faqSection.scrollIntoViewIfNeeded();

    const faqButton = page.getByRole("button", { name: /\?/ }).first();
    const answerInCard = faqButton.locator(".. >> p");

    // Open
    await expect(async () => {
      await faqButton.click();
      await expect(answerInCard).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    // Close
    await faqButton.click();
    await expect(answerInCard).toBeHidden();
  });
});
