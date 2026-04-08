import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import HeroSection from "@/components/about/HeroSection.astro";

describe("About HeroSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("<section");
  });

  it("renders the label text", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Om Vipsa");
  });

  it("renders the h1 heading", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const h1 = doc.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain("Din partner för ett");
    expect(h1!.textContent).toContain("renare hem");
  });

  it("renders the highlighted text with primary color", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const span = doc.querySelector("h1 span");
    expect(span).not.toBeNull();
    expect(span!.textContent).toBe("renare hem");
    expect(span!.classList.contains("text-primary")).toBe(true);
  });

  it("renders the description paragraph", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Vi skapar utrymme för livet");
  });

  it("renders the hero image with correct alt", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain('alt="Clean Nordic Living Room"');
  });

  it("loads the hero image eagerly", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain('loading="eager"');
  });
});
