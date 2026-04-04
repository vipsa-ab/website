import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import HeroSection from "@/components/landing/HeroSection.astro";

describe("HeroSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the badge text", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Proffsig Hemstädning");
  });

  it("renders the h1 heading", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const h1 = doc.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain("Ett renare hem,");
  });

  it("renders the highlighted h1 span", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const span = doc.querySelector("h1 span");
    expect(span).not.toBeNull();
    expect(span!.textContent).toContain("mer tid för livet.");
  });

  it("renders the primary CTA button", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Boka städning");
  });

  it("renders the secondary CTA button", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Våra tjänster");
  });

  it("renders the hero image with correct alt", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain('alt="Ren lägenhet"');
  });

  it("renders the guarantee card text", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("100% Nöjd-kund-garanti");
    expect(html).toContain("Vi städar tills du är nöjd");
  });

  it("renders the check-circle icon", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain('data-icon="material-symbols:check-circle"');
  });

  it("wraps content in a header element", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("<header");
  });
});
