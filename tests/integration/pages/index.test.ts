import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import IndexPage from "@/pages/index.astro";

describe("Index Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(IndexPage);
  });

  it("passes page-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/vipsa/i);
  });

  it("passes page-specific description to meta tag", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBeTruthy();
  });

  it("sets the document language to Swedish", () => {
    expect(page.doc.documentElement.getAttribute("lang")).toBe("sv");
  });

  it("assembles header, main, and footer landmarks", () => {
    expect(page.screen.getByRole("banner")).toBeDefined();
    expect(page.screen.getByRole("main")).toBeDefined();
    expect(page.screen.getByRole("contentinfo")).toBeDefined();
  });

  it("header provides navigation with links to all main routes", () => {
    const banner = page.screen.getByRole("banner");
    const nav = banner.querySelector("nav");
    expect(nav).not.toBeNull();

    const hrefs = Array.from(nav!.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining(["/", "/services", "/about", "/pricing", "/contact"]),
    );
  });

  it("header provides a booking call-to-action linking to /booking", () => {
    const banner = page.screen.getByRole("banner");
    const bookingLink = banner.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
  });

  it("footer provides navigation links for key routes", () => {
    const footer = page.screen.getByRole("contentinfo");
    const hrefs = Array.from(footer.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining(["/", "/services", "/about", "/booking"]),
    );
  });

  it("footer provides legal links (privacy and terms)", () => {
    const footer = page.screen.getByRole("contentinfo");
    expect(footer.querySelector('a[href="/privacy"]')).not.toBeNull();
    expect(footer.querySelector('a[href="/terms"]')).not.toBeNull();
  });
});

describe("Index Page — section composition", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(IndexPage);
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

  it("provides a booking entry-point link within the page content", () => {
    const main = page.screen.getByRole("main");
    const bookingLink = main.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
  });

  it("renders service navigation links to individual service pages", () => {
    const main = page.screen.getByRole("main");
    const serviceLinks = main.querySelectorAll(
      'a[href^="/services/"]',
    );
    expect(serviceLinks.length).toBeGreaterThanOrEqual(1);
  });
});
