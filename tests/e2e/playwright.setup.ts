import { test as base, type BrowserContext } from "@playwright/test";

export { type BrowserContext };

export const test = base.extend<{ context: BrowserContext }>({
  context: async ({ context }, use) => {
    await context.route("http://localhost:3000/**", (route) => {
      if (route.request().method() === "POST") {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: "{}",
          });
        }, 150);
      } else {
        route.continue();
      }
    });
    await use(context);
  },
});
