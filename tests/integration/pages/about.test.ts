import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import AboutPage from "@/pages/about.astro";

describe("About Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(AboutPage);
  });

  it("passes an about-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/om\s+vipsa/i);
  });

  it("passes an about-specific meta description", () => {
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
      expect.arrayContaining(["/", "/services", "/about", "/pricing", "/contact"]),
    );
  });
});

describe("About Page — team data propagation", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(AboutPage);
  });

  it("renders multiple team member cards with distinct names", () => {
    const main = page.screen.getByRole("main");
    // TeamCard renders member names in h4 elements
    const memberNames = Array.from(main.querySelectorAll("h4")).map(
      (h) => h.textContent?.trim(),
    );
    expect(memberNames.length).toBeGreaterThanOrEqual(3);
    const unique = new Set(memberNames);
    expect(unique.size).toBe(memberNames.length);
  });

  it("each team member has an associated image", () => {
    const main = page.screen.getByRole("main");
    const images = main.querySelectorAll("img");
    const memberCount = main.querySelectorAll("h4").length;
    expect(images.length).toBeGreaterThanOrEqual(memberCount);
  });
});

describe("About Page — section composition", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(AboutPage);
  });

  it("renders a primary heading within main content", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent!.trim().length).toBeGreaterThan(0);
  });

  it("renders multiple content sections inside main", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(3);
  });

  it("provides a booking entry-point within the page content", () => {
    const main = page.screen.getByRole("main");
    const bookingLink = main.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
  });
});
