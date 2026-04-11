import { test, expect, type Page } from "@playwright/test";

// --- Helpers ---

/**
 * Wait for the BookingForm React island to finish hydration.
 * Scrolls the form into view (triggers client:visible) then polls for React internals.
 */
async function waitForFormHydration(page: Page) {
  const form = page.locator("form");
  await form.scrollIntoViewIfNeeded();
  await form.evaluate((el) => {
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
 * Fill the size input with a value.
 */
async function fillSize(page: Page, value: string) {
  const sizeInput = page.getByPlaceholder("t.ex. 75");
  await sizeInput.fill(value);
  await sizeInput.dispatchEvent("input");
}

/**
 * Click a frequency label by its for-attribute id.
 * The radio inputs are sr-only so Playwright can't click them directly —
 * the wrapping <label> intercepts. Same pattern as pricing-calculator.spec.ts.
 */
async function selectFrequency(page: Page, id: string) {
  await page.locator(`label[for="${id}"]`).click();
}

/**
 * Navigate to next month and click the first available day to reveal time slots.
 */
async function selectFirstAvailableDate(page: Page) {
  await page.getByRole("button", { name: "Nästa månad" }).click();
  await expect(async () => {
    const dayBtn = page.locator("td button:not([disabled])").first();
    await dayBtn.click();
    await expect(page.getByText(/08:00|13:00|18:00/).first()).toBeVisible({
      timeout: 1000,
    });
  }).toPass({ timeout: 10000 });
}

// --- Tests ---

test.describe("Booking form — page load & hydration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
  });

  test("page renders the hero heading", async ({ page }) => {
    await expect(page.getByRole("main").locator("h1")).toContainText(/boka/i);
  });

  test("form island hydrates and becomes interactive", async ({ page }) => {
    await waitForFormHydration(page);
    const homeRadio = page.getByRole("radio", { name: /hemstädning/i });
    await expect(homeRadio).toBeChecked();
  });

  test("page title contains booking keyword", async ({ page }) => {
    await expect(page).toHaveTitle(/boka/i);
  });
});

test.describe("Booking form — service selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
    await waitForFormHydration(page);
  });

  test("user selects a different service and sees it reflected", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: /flyttstädning/i }).check();
    await expect(
      page.getByRole("radio", { name: /flyttstädning/i }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", { name: /hemstädning/i }),
    ).not.toBeChecked();
  });

  test("user cycles through all four services", async ({ page }) => {
    const services = [
      /hemstädning/i,
      /flyttstädning/i,
      /kontorsstädning/i,
      /fönsterputs/i,
    ];
    for (const name of services) {
      await page.getByRole("radio", { name }).check();
      await expect(page.getByRole("radio", { name })).toBeChecked();
    }
  });
});

test.describe("Booking form — pricing updates", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
    await waitForFormHydration(page);
  });

  test("user enters size and sees price appear in summary", async ({
    page,
  }) => {
    await fillSize(page, "75");
    const summary = page.locator("aside");
    // Home cleaning: 75 * 12 = 900 kr base
    await expect(summary).toContainText("900 kr");
  });

  test("user sees the RUT discount (50%) in the summary", async ({ page }) => {
    await fillSize(page, "100");
    const summary = page.locator("aside");
    // Home: 100*12=1200 base, weekly discount 100, fee 49 → before=1149 → after=575
    await expect(summary).toContainText("575 kr");
  });

  test("user changes frequency and price recalculates", async ({ page }) => {
    await fillSize(page, "75");
    // Switch to monthly (no discount)
    await selectFrequency(page, "freq-monthly");

    const summary = page.locator("aside");
    // base=900, discount=0, fee=49 → before=949 → after=475
    await expect(summary).toContainText("949 kr");
    await expect(summary).toContainText("475 kr");
  });

  test("user switches service and price rate changes", async ({ page }) => {
    await fillSize(page, "100");
    // Home: 100 * 12 = 1200
    await expect(page.locator("aside")).toContainText("1200 kr");

    // Moving: 100 * 20 = 2000
    await page.getByRole("radio", { name: /flyttstädning/i }).check();
    await expect(page.locator("aside")).toContainText("2000 kr");
  });

  test("summary shows dash when no valid size is entered", async ({ page }) => {
    await expect(page.locator("aside")).toContainText("—");
  });
});

test.describe("Booking form — calendar interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
    await waitForFormHydration(page);
  });

  test("user sees date picker placeholder before selecting a date", async ({
    page,
  }) => {
    await expect(
      page.getByText("Välj ett datum för att se tider"),
    ).toBeVisible();
  });

  test("user navigates to the next month in the calendar", async ({ page }) => {
    const monthHeading = page
      .locator("h3")
      .filter({
        hasText:
          /januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december/i,
      })
      .first();
    const initialMonth = await monthHeading.textContent();

    await page.getByRole("button", { name: "Nästa månad" }).click();
    await expect(monthHeading).not.toHaveText(initialMonth!);
  });

  test("user selects an available date and sees time slots", async ({
    page,
  }) => {
    await selectFirstAvailableDate(page);
    // At least one time slot should be visible
    await expect(page.getByText(/08:00|13:00|18:00/).first()).toBeVisible();
  });

  test("user selects a time slot and sees it highlighted", async ({ page }) => {
    await selectFirstAvailableDate(page);

    // Click the first available time slot
    const timeSlot = page.getByText(/08:00|13:00|18:00/).first();
    const slotButton = timeSlot.locator("..");
    await slotButton.click();

    // The selected slot should have the primary-container background class
    await expect(slotButton).toHaveClass(/bg-primary-container/);
  });

  test("selecting a new date clears the previously selected time slot", async ({
    page,
  }) => {
    await selectFirstAvailableDate(page);

    // Select a time slot
    const timeSlot = page.getByText(/08:00|13:00|18:00/).first();
    await timeSlot.locator("..").click();
    await expect(timeSlot.locator("..")).toHaveClass(/bg-primary-container/);

    // Navigate to next month and select another date
    await page.getByRole("button", { name: /n.sta m.nad/i }).click();
    await expect(async () => {
      const dayBtn = page.locator("td button:not([disabled])").first();
      await dayBtn.click();
      await expect(page.getByText(/08:00|13:00|18:00/).first()).toBeVisible({
        timeout: 1000,
      });
    }).toPass({ timeout: 10000 });

    // No slot should be selected (none should have primary-container bg)
    const selectedSlots = page.locator("button.bg-primary-container");
    // Only calendar-related elements may match, not time slot buttons
    const timeSlotArea = page
      .locator("form")
      .locator("h3", { hasText: /lediga tider|välj ett datum/i })
      .locator("..");
    const selectedInArea = timeSlotArea.locator("button.bg-primary-container");
    await expect(selectedInArea).toHaveCount(0);
  });
});

test.describe("Booking form — contact fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
    await waitForFormHydration(page);
  });

  test("user fills in all contact fields", async ({ page }) => {
    await page.getByPlaceholder("Erik Andersson").fill("Test Testsson");
    await page.getByPlaceholder("erik@exempel.se").fill("test@test.se");
    await page.getByPlaceholder("070-123 45 67").fill("0701234567");
    await page.getByPlaceholder("ÅÅMMDD-XXXX").fill("900101-1234");
    await page
      .getByPlaceholder("Storgatan 1, 123 45 Växjö")
      .fill("Testgatan 1, 123 45 Stockholm");

    await expect(page.getByPlaceholder("Erik Andersson")).toHaveValue(
      "Test Testsson",
    );
    await expect(page.getByPlaceholder("erik@exempel.se")).toHaveValue(
      "test@test.se",
    );
  });

  test("user sees validation error for invalid email", async ({ page }) => {
    const emailInput = page.getByPlaceholder("erik@exempel.se");
    await emailInput.fill("not-email");
    await emailInput.blur();

    await expect(page.getByText("Ogiltig e-postadress")).toBeVisible();
  });

  test("user sees validation error for invalid personnummer format", async ({
    page,
  }) => {
    const pnrInput = page.getByPlaceholder("ÅÅMMDD-XXXX");
    await pnrInput.fill("12345");
    await pnrInput.blur();

    await expect(page.getByText("Format: ÅÅMMDD-XXXX")).toBeVisible();
  });

  test("user sees validation error for short address", async ({ page }) => {
    const addressInput = page.getByPlaceholder("Storgatan 1, 123 45 Växjö");
    await addressInput.fill("AB");
    await addressInput.blur();

    await expect(page.getByText("Ange fullständig adress")).toBeVisible();
  });
});

test.describe("Booking form — submit button state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/booking");
    await waitForFormHydration(page);
  });

  test("submit button is disabled when form is incomplete", async ({
    page,
  }) => {
    const submitBtn = page.getByRole("button", { name: /bekräfta bokning/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("submit button text reads Bekräfta bokning", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /bekräfta bokning/i }),
    ).toBeVisible();
  });
});

test.describe("Booking form — full user journey", () => {
  test("user completes the entire booking flow", async ({ page }) => {
    await page.goto("/booking");
    await waitForFormHydration(page);

    // Step 1: Select service
    await page.getByRole("radio", { name: /hemstädning/i }).check();

    // Step 2: Enter housing info
    await fillSize(page, "75");
    await page.getByLabel("Antal rum").selectOption("3");
    await selectFrequency(page, "freq-biweekly");

    // Verify price updated in summary
    const summary = page.locator("aside");
    await expect(summary).toContainText("900 kr");
    await expect(summary).toContainText("-50 kr");

    // Step 3: Select date and time
    await selectFirstAvailableDate(page);
    const timeSlot = page.getByText(/08:00|13:00|18:00/).first();
    await timeSlot.locator("..").click();

    // Step 4: Fill contact info
    await page.getByPlaceholder("Erik Andersson").fill("Anna Svensson");
    await page.getByPlaceholder("erik@exempel.se").fill("anna@test.se");
    await page.getByPlaceholder("070-123 45 67").fill("0701234567");
    await page.getByPlaceholder("ÅÅMMDD-XXXX").fill("811228-9874");
    await page
      .getByPlaceholder("Storgatan 1, 123 45 Växjö")
      .fill("Sveavägen 10, 111 57 Stockholm");

    // Submit should become enabled
    const submitBtn = page.getByRole("button", { name: /bekräfta bokning/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });

    // Submit the form
    await submitBtn.click();

    // Success toast should appear
    await expect(page.getByText("Bokning bekräftad!")).toBeVisible({
      timeout: 5000,
    });
  });
});
