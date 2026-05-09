import { test as base, type BrowserContext } from "@playwright/test";

export { type BrowserContext };

export const test = base.extend<{ context: BrowserContext }>({});
