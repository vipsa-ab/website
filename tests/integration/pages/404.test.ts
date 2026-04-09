import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import Page404 from "@/pages/404.astro";

describe("404 Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(Page404);
  });

  it("passes a 404-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/404/i);
  });

  it("passes a 404-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBeTruthy();
  });

  it("assembles header, main, and footer landmarks", () => {
    expect(page.screen.getByRole("banner")).toBeDefined();
    expect(page.screen.getByRole("main")).toBeDefined();
    expect(page.screen.getByRole("contentinfo")).toBeDefined();
  });
});

describe("404 Page — recovery paths", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(Page404);
  });

  it("renders a primary heading communicating the error", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent!.trim().length).toBeGreaterThan(0);
  });

  it("provides a link back to the homepage", () => {
    const main = page.screen.getByRole("main");
    const homeLink = main.querySelector('a[href="/"]');
    expect(homeLink).not.toBeNull();
  });

  it("provides a link to the contact page", () => {
    const main = page.screen.getByRole("main");
    const contactLink = main.querySelector('a[href="/contact"]');
    expect(contactLink).not.toBeNull();
  });

  it("offers suggestion cards to guide the user forward", () => {
    const main = page.screen.getByRole("main");
    const headings = main.querySelectorAll("h3");
    expect(headings.length).toBeGreaterThanOrEqual(2);
  });
});
