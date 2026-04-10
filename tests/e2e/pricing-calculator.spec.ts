import { test, expect, type Locator } from "@playwright/test";

/**
 * Wait for the CalculatorSection React island to finish hydration.
 * Scrolls it into view (triggers client:visible) then polls for React internals.
 */
async function waitForCalculatorHydration(slider: Locator) {
  await slider.scrollIntoViewIfNeeded();
  await slider.evaluate((el) => {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (Object.keys(el).some((k) => k.startsWith("__react"))) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  });
}

/**
 * Click at a horizontal ratio on the slider track (0 = min, 1 = max).
 */
async function clickSliderAt(slider: Locator, ratio: number) {
  const box = await slider.boundingBox();
  if (!box) throw new Error("Slider not visible");
  await slider.click({
    position: {
      x: box.width * Math.max(0.01, Math.min(ratio, 0.99)),
      y: box.height / 2,
    },
  });
}

function kvmToRatio(kvm: number) {
  return (kvm - 20) / (300 - 20);
}

test.describe("Pricing calculator — post-hydration interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
    const slider = page.getByRole("slider");
    await waitForCalculatorHydration(slider);
  });

  test("user adjusts the slider and sees the price update", async ({
    page,
  }) => {
    const slider = page.getByRole("slider");

    // Click near the max end of the slider
    await clickSliderAt(slider, kvmToRatio(295));

    // kvm display should have changed from default
    await expect(page.locator("#kvm-display")).not.toHaveText("75 kvm");

    // Price should have changed from the default 813 kr
    const priceText = await page.locator("#price-after").textContent();
    expect(priceText).not.toBe("813 kr");

    // Before-RUT is always double
    const afterPrice = Number(priceText!.match(/(\d+)/)![1]);
    const beforeText = await page.locator("#price-before").textContent();
    const beforePrice = Number(beforeText!.match(/(\d+)/)![1]);
    expect(beforePrice).toBe(afterPrice * 2);
  });

  test("user changes frequency and sees the price recalculate", async ({
    page,
  }) => {
    // Click the weekly label
    await page.locator('label[for="freq-weekly"]').click();

    // Weekly 75 kvm: Math.round((75/36)*390*0.9) = 731
    await expect(page.locator("#price-after")).toHaveText(/731\s*kr/);
    await expect(
      page.getByRole("radio", { name: /varje vecka/i }),
    ).toBeChecked();
  });

  test("user combines slider and frequency to estimate a cleaning cost", async ({
    page,
  }) => {
    const slider = page.getByRole("slider");

    // Move slider to a different position
    await clickSliderAt(slider, kvmToRatio(20));
    await expect(page.locator("#kvm-display")).toHaveText(/20\s*kvm/);

    // Switch to monthly
    await page.locator('label[for="freq-monthly"]').click();
    await expect(page.getByRole("radio", { name: /månatlig/i })).toBeChecked();

    // 20 kvm, monthly (1.1): Math.round((20/36)*390*1.1) = 238
    await expect(page.locator("#price-after")).toHaveText(/238\s*kr/);
    await expect(page.locator("#price-before")).toHaveText(/476\s*kr/);
  });
});

test.describe("Pricing FAQ — post-hydration interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("user expands a pricing FAQ and sees the answer", async ({ page }) => {
    const faqSection = page.locator("section", {
      has: page.getByText("Vanliga frågor om priser"),
    });
    await faqSection.scrollIntoViewIfNeeded();

    const firstFaqButton = faqSection.getByRole("button").first();

    await expect(async () => {
      await firstFaqButton.click();
      const answer = firstFaqButton.locator(".. >> p");
      await expect(answer).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });
  });

  test("user expands and collapses a pricing FAQ answer", async ({ page }) => {
    const faqSection = page.locator("section", {
      has: page.getByText("Vanliga frågor om priser"),
    });
    await faqSection.scrollIntoViewIfNeeded();

    const faqButton = faqSection.getByRole("button").first();
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
