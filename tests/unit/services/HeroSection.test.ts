import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import HeroSection from "@/components/services/HeroSection.astro";

describe("Services HeroSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the label text", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Välkommen till en renare vardag");
  });

  it("renders the h1 heading", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const h1 = doc.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toContain("Våra Tjänster");
  });

  it("renders the description paragraph", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("Vi kombinerar den svenska enkelheten");
  });

  it("renders the booking CTA link with correct href", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const bookingLink = doc.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
    expect(bookingLink!.textContent?.trim()).toBe("Boka städning");
  });

  it("renders the pricing CTA link with correct href", async () => {
    const html = await container.renderToString(HeroSection);
    const doc = new JSDOM(html).window.document;
    const pricingLink = doc.querySelector('a[href="/pricing"]');
    expect(pricingLink).not.toBeNull();
    expect(pricingLink!.textContent?.trim()).toBe("Se priser");
  });

  it("renders the hero image with correct alt", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain('alt="Ren lägenhet"');
  });

  it("renders the guarantee card", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("100% Nöjd-kund-garanti");
    expect(html).toContain("Vi städar tills du är nöjd");
  });

  it("renders the check-circle icon", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain('data-icon="material-symbols:check-circle"');
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(HeroSection);
    expect(html).toContain("<section");
  });
});
