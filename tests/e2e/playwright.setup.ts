import { test as base, type BrowserContext } from "@playwright/test";

export { type BrowserContext };

export const test = base.extend<{ context: BrowserContext }>({
  context: async ({ context }, use) => {
    await context.route("http://localhost:3000/**", async (route) => {
      if (route.request().method() === "POST") {
        // Artificial delay so the loading state ("Skickar...") is observable
        await new Promise((resolve) => setTimeout(resolve, 200));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      } else {
        await route.continue();
      }
    });
    await use(context);
  },
});
