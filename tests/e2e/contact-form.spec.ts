import { test, expect, type Page } from "@playwright/test";

// --- Helpers ---

/**
 * Wait for the ContactForm React island to finish hydration.
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
 * Fill all contact form fields with valid data.
 */
async function fillAllFields(page: Page) {
  await page.getByPlaceholder("Ditt namn").fill("Erik Andersson");
  await page.getByPlaceholder("namn@exempel.se").fill("erik@test.se");
  await page.getByPlaceholder("070-000 00 00").fill("0701234567");
  await page
    .getByPlaceholder("Hur kan vi hjälpa dig?")
    .fill("Jag behöver hjälp med hemstädning varje vecka.");
}

// --- Tests ---

test.describe("Contact form — page load & hydration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("page renders the hero heading", async ({ page }) => {
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });

  test("page title contains contact keyword", async ({ page }) => {
    await expect(page).toHaveTitle(/kontakta/i);
  });

  test("form island hydrates and becomes interactive", async ({ page }) => {
    await waitForFormHydration(page);
    const submitBtn = page.getByRole("button", { name: /skicka förfrågan/i });
    await expect(submitBtn).toBeVisible();
  });
});

test.describe("Contact form — trust bar", () => {
  test("displays all three trust indicators", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(/snabbt svar/i)).toBeVisible();
    await expect(page.getByText(/certifierade/i)).toBeVisible();
    await expect(page.getByText(/ansvarsförsäkring/i)).toBeVisible();
  });
});

test.describe("Contact form — info section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("displays phone number", async ({ page }) => {
    await expect(page.getByText("010-123 45 67")).toBeVisible();
  });

  test("displays email address", async ({ page }) => {
    await expect(page.getByText("hej@vipsa.se")).toBeVisible();
  });

  test("displays office address", async ({ page }) => {
    const addresses = page.getByText("Ormbergsvägen 15, 193 36 Sigtuna");
    await expect(addresses.first()).toBeVisible();
  });
});

test.describe("Contact form — field validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await waitForFormHydration(page);
  });

  test("shows error for short name", async ({ page }) => {
    await page.getByPlaceholder("Ditt namn").fill("A");
    await page.getByPlaceholder("Ditt namn").blur();
    await expect(page.getByText("Minst 2 tecken")).toBeVisible();
  });

  test("shows error for invalid email", async ({ page }) => {
    await page.getByPlaceholder("namn@exempel.se").fill("bad-email");
    await page.getByPlaceholder("namn@exempel.se").blur();
    await expect(page.getByText("Ogiltig e-postadress")).toBeVisible();
  });

  test("shows error for short phone", async ({ page }) => {
    await page.getByPlaceholder("070-000 00 00").fill("123");
    await page.getByPlaceholder("070-000 00 00").blur();
    await expect(page.getByText("Ogiltigt telefonnummer")).toBeVisible();
  });

  test("shows error for short message", async ({ page }) => {
    await page.getByPlaceholder("Hur kan vi hjälpa dig?").fill("Hej");
    await page.getByPlaceholder("Hur kan vi hjälpa dig?").blur();
    await expect(page.getByText("Minst 10 tecken")).toBeVisible();
  });

  test("clears error when valid input is provided", async ({ page }) => {
    const nameInput = page.getByPlaceholder("Ditt namn");
    await nameInput.fill("A");
    await nameInput.blur();
    await expect(page.getByText("Minst 2 tecken")).toBeVisible();

    await nameInput.fill("Erik Andersson");
    await nameInput.blur();
    await expect(page.getByText("Minst 2 tecken")).not.toBeVisible();
  });
});

test.describe("Contact form — service select", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await waitForFormHydration(page);
  });

  test("defaults to Hemstädning", async ({ page }) => {
    const select = page.getByLabel("Typ av tjänst");
    await expect(select).toHaveValue("Hemstädning");
  });

  test("user can change service selection", async ({ page }) => {
    const select = page.getByLabel("Typ av tjänst");
    await select.selectOption("Flyttstädning");
    await expect(select).toHaveValue("Flyttstädning");
  });

  test("user can select all service options", async ({ page }) => {
    const select = page.getByLabel("Typ av tjänst");
    for (const option of [
      "Hemstädning",
      "Flyttstädning",
      "Kontorsstädning",
      "Annat",
    ]) {
      await select.selectOption(option);
      await expect(select).toHaveValue(option);
    }
  });
});

test.describe("Contact form — submit button state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await waitForFormHydration(page);
  });

  test("submit button is disabled when form is incomplete", async ({
    page,
  }) => {
    const btn = page.getByRole("button", { name: /skicka förfrågan/i });
    await expect(btn).toBeDisabled();
  });

  test("submit button enables when all fields are valid", async ({ page }) => {
    await fillAllFields(page);
    const btn = page.getByRole("button", { name: /skicka förfrågan/i });
    await expect(btn).toBeEnabled({ timeout: 3000 });
  });

  test("submit button disables again when a field becomes invalid", async ({
    page,
  }) => {
    await fillAllFields(page);
    const btn = page.getByRole("button", { name: /skicka förfrågan/i });
    await expect(btn).toBeEnabled({ timeout: 3000 });

    await page.getByPlaceholder("Ditt namn").fill("");
    await page.getByPlaceholder("Ditt namn").blur();
    await expect(btn).toBeDisabled();
  });
});

test.describe("Contact form — full user journey", () => {
  test("user completes the entire contact form and submits", async ({
    page,
  }) => {
    await page.goto("/contact");
    await waitForFormHydration(page);

    // Fill all fields
    await page.getByPlaceholder("Ditt namn").fill("Anna Svensson");
    await page.getByPlaceholder("namn@exempel.se").fill("anna@test.se");
    await page.getByPlaceholder("070-000 00 00").fill("0701234567");
    await page.getByLabel("Typ av tjänst").selectOption("Flyttstädning");
    await page
      .getByPlaceholder("Hur kan vi hjälpa dig?")
      .fill("Vi ska flytta nästa månad och behöver hjälp med städning.");

    // Submit should be enabled
    const submitBtn = page.getByRole("button", { name: /skicka förfrågan/i });
    await expect(submitBtn).toBeEnabled({ timeout: 3000 });

    // Submit the form
    await submitBtn.click();

    // Success toast should appear
    await expect(page.getByText("Meddelande skickat!")).toBeVisible({
      timeout: 5000,
    });
  });

  test("button shows loading state during submission", async ({ page }) => {
    await page.goto("/contact");
    await waitForFormHydration(page);

    await fillAllFields(page);

    const submitBtn = page.getByRole("button", { name: /skicka förfrågan/i });
    await expect(submitBtn).toBeEnabled({ timeout: 3000 });

    // Click and immediately check for loading text
    await submitBtn.click();
    await expect(page.getByText("Skickar...")).toBeVisible();
  });
});

test.describe("Contact form — map section", () => {
  test("map container is visible", async ({ page }) => {
    await page.goto("/contact");

    // Scroll to the map area — it's a client:visible island
    const mapInfo = page.getByText("Vårt huvudkontor");
    await mapInfo.scrollIntoViewIfNeeded();
    await expect(mapInfo).toBeVisible();
  });

  test("map shows office address", async ({ page }) => {
    await page.goto("/contact");
    const addresses = page.getByText("Ormbergsvägen 15, 193 36 Sigtuna");
    // Address appears in both info section and map card
    await expect(addresses.first()).toBeVisible();
  });
});

test.describe("Contact page — navigation funnel", () => {
  test("user reaches contact page from homepage header nav", async ({
    page,
    viewport,
  }) => {
    test.skip(
      (viewport?.width ?? 1280) < 768,
      "Desktop header nav is hidden on mobile viewports",
    );

    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("link", { name: /kontakt/i })
      .click();

    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });

  test("user reaches contact page from homepage CTA or header", async ({
    page,
    viewport,
  }) => {
    test.skip(
      (viewport?.width ?? 1280) < 768,
      "Desktop header nav is hidden on mobile viewports",
    );

    await page.goto("/");
    // Navigate via the header link (footer doesn't link to /contact)
    await page
      .getByRole("banner")
      .getByRole("link", { name: /kontakt/i })
      .click();

    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });
});
