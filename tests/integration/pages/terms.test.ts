import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import TermsPage from "@/pages/terms.astro";

describe("Terms Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(TermsPage);
  });

  it("passes a terms-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/användarvillkor/i);
  });

  it("passes a terms-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBeTruthy();
  });

  it("assembles header, main, and footer landmarks", () => {
    expect(page.screen.getByRole("banner")).toBeDefined();
    expect(page.screen.getByRole("main")).toBeDefined();
    expect(page.screen.getByRole("contentinfo")).toBeDefined();
  });
});

describe("Terms Page — content structure", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(TermsPage);
  });

  it("renders the main heading", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toMatch(/användarvillkor/i);
  });

  it("renders all six content sections", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBe(6);
  });

  it("each section has a numbered heading", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    sections.forEach((section) => {
      const heading = section.querySelector("h2");
      expect(heading).not.toBeNull();
      expect(heading!.textContent!.trim().length).toBeGreaterThan(0);
    });
  });
});

describe("Terms Page — sidebar navigation", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(TermsPage);
  });

  it("renders a table of contents with anchor links", () => {
    const main = page.screen.getByRole("main");
    const aside = main.querySelector("aside");
    expect(aside).not.toBeNull();
    const links = aside!.querySelectorAll("a[href^='#']");
    expect(links.length).toBe(6);
  });

  it("each anchor link targets a section that exists in the document", () => {
    const main = page.screen.getByRole("main");
    const aside = main.querySelector("aside");
    const links = aside!.querySelectorAll("a[href^='#']");
    links.forEach((link) => {
      const targetId = link.getAttribute("href")!.slice(1);
      const target = main.querySelector(`#${targetId}`);
      expect(target).not.toBeNull();
    });
  });
});

describe("Terms Page — cross-linking", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(TermsPage);
  });

  it("links to the privacy policy page from the GDPR section", () => {
    const main = page.screen.getByRole("main");
    const privacyLink = main.querySelector('a[href="/privacy"]');
    expect(privacyLink).not.toBeNull();
  });
});
