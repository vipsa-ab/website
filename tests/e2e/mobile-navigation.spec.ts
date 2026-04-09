import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 812 } });

test.describe("Mobile navigation journey", () => {
  test("user opens mobile menu, navigates to services, and reaches booking", async ({
    page,
  }) => {
    await page.goto("/");

    // Open the mobile menu
    const menuTrigger = page.getByRole("button", { name: /öppna/i });
    await menuTrigger.click();

    // Menu drawer is visible
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();

    // Navigate to services (dispatchEvent: drawer is portaled with fixed position)
    await drawer
      .getByRole("link", { name: /tjänster/i })
      .dispatchEvent("click");
    await expect(page).toHaveURL(/\/services/);

    // Drawer should close after navigation
    await expect(menuTrigger).toHaveAttribute("aria-expanded", "false");

    // Now reach booking from the services page
    const bookingCta = page
      .getByRole("main")
      .getByRole("link", { name: /boka/i });
    await bookingCta.first().click();
    await expect(page).toHaveURL(/\/booking/);
  });

  test("user reaches booking directly from mobile menu CTA", async ({
    page,
  }) => {
    await page.goto("/");

    const menuTrigger = page.getByRole("button", { name: /öppna/i });
    await menuTrigger.click();

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();

    // Click the booking CTA inside the drawer (dispatchEvent: portaled fixed element)
    await drawer.getByRole("link", { name: /boka/i }).dispatchEvent("click");
    await expect(page).toHaveURL(/\/booking/);
  });

  test("user can navigate between multiple pages via mobile menu", async ({
    page,
  }) => {
    await page.goto("/");

    // Go to About
    await page.getByRole("button", { name: /öppna/i }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /om/i })
      .dispatchEvent("click");
    await expect(page).toHaveURL(/\/about/);

    // Go to Services from About
    await page.getByRole("button", { name: /öppna/i }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /tjänster/i })
      .dispatchEvent("click");
    await expect(page).toHaveURL(/\/services/);

    // Verify content loaded (not a broken transition)
    await expect(page.getByRole("main").locator("h1")).toBeVisible();
  });
});
