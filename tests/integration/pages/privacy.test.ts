import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import PrivacyPage from "@/pages/privacy.astro";

describe("Privacy Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PrivacyPage);
  });

  it("passes a privacy-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/integritetspolicy/i);
  });

  it("passes a privacy-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBeTruthy();
  });

  it("assembles header, main, and footer landmarks", () => {
    expect(page.screen.getByRole("banner")).toBeDefined();
    expect(page.screen.getByRole("main")).toBeDefined();
    expect(page.screen.getByRole("contentinfo")).toBeDefined();
  });
});

describe("Privacy Page — content structure", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PrivacyPage);
  });

  it("renders the main heading", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toMatch(/integritetspolicy/i);
  });

  it("renders all seven policy sections", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBe(7);
  });

  it("each section has a heading", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    sections.forEach((section) => {
      const heading = section.querySelector("h2, h3");
      expect(heading).not.toBeNull();
      expect(heading!.textContent!.trim().length).toBeGreaterThan(0);
    });
  });

  it("includes contact information with email and phone links", () => {
    const main = page.screen.getByRole("main");
    const emailLink = main.querySelector('a[href^="mailto:"]');
    const phoneLink = main.querySelector('a[href^="tel:"]');
    expect(emailLink).not.toBeNull();
    expect(phoneLink).not.toBeNull();
  });

  it("mentions GDPR in the introductory text", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/GDPR/);
  });
});
