import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import AboutSection from "@/components/landing/AboutSection.astro";

describe("AboutSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(AboutSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent?.trim()).toBe("Om Vipsa");
  });

  it("renders the team image with correct alt", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain('alt="Vårt team"');
  });

  it("renders the first paragraph about the company", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain("lokalt städföretag");
  });

  it("renders the second paragraph about methods", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain("moderna metoder");
  });

  it("renders the 500+ stat", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain("500+");
  });

  it("renders the Nöjda Kunder label", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain("Nöjda Kunder");
  });

  it("renders the 10k+ stat", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain("10k+");
  });

  it("renders the Städtimmar label", async () => {
    const html = await container.renderToString(AboutSection);
    expect(html).toContain("Städtimmar");
  });
});
