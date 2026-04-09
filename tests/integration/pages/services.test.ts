import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import ServicesPage from "@/pages/services/index.astro";

describe("Services Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ServicesPage);
  });

  it("passes a services-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/tjänster/i);
  });

  it("passes a services-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBeTruthy();
  });

  it("assembles header, main, and footer landmarks", () => {
    expect(page.screen.getByRole("banner")).toBeDefined();
    expect(page.screen.getByRole("main")).toBeDefined();
    expect(page.screen.getByRole("contentinfo")).toBeDefined();
  });

  it("header navigation includes links to all main routes", () => {
    const nav = page.screen.getByRole("banner").querySelector("nav");
    const hrefs = Array.from(nav!.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/",
        "/services",
        "/about",
        "/pricing",
        "/contact",
      ]),
    );
  });
});

describe("Services Page — pricing data propagation", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ServicesPage);
  });

  it("renders multiple pricing tiers with distinct headings", () => {
    const main = page.screen.getByRole("main");
    const headings = Array.from(main.querySelectorAll("h4")).map((h) =>
      h.textContent?.trim(),
    );

    expect(headings.length).toBeGreaterThanOrEqual(3);
    const unique = new Set(headings);
    expect(unique.size).toBe(headings.length);
  });

  it("each pricing tier has a price amount containing 'kr'", () => {
    const main = page.screen.getByRole("main");
    const html = main.innerHTML;
    const priceMatches = html.match(/\d+[\s.]?\d*\s*kr/g);
    expect(priceMatches).not.toBeNull();
    expect(priceMatches!.length).toBeGreaterThanOrEqual(3);
  });

  it("each pricing tier has an actionable CTA button", () => {
    const main = page.screen.getByRole("main");
    const buttons = main.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Services Page — FAQ integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ServicesPage);
  });

  it("renders multiple FAQ interactive buttons", () => {
    const main = page.screen.getByRole("main");
    // FaqCard renders a <button> for each question
    // There should be at least 3 FAQ items
    const buttons = Array.from(main.querySelectorAll("button"));
    // Filter to buttons that are likely FAQ (not pricing CTAs)
    // FAQ buttons contain question text (longer than CTA labels)
    const faqButtons = buttons.filter(
      (b) => (b.textContent?.trim().length ?? 0) > 20,
    );
    expect(faqButtons.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Services Page — call-to-action integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ServicesPage);
  });

  it("provides a booking entry-point within the page content", () => {
    const main = page.screen.getByRole("main");
    const bookingLink = main.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
  });

  it("provides a pricing navigation link within the page content", () => {
    const main = page.screen.getByRole("main");
    const pricingLink = main.querySelector('a[href="/pricing"]');
    expect(pricingLink).not.toBeNull();
  });
});
