import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import CtaSection from "@/components/services/CtaSection.astro";

describe("CtaSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the heading", async () => {
    const html = await container.renderToString(CtaSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toContain("Redo för en renare vardag?");
  });

  it("renders the description text", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain("Boka din första städning idag");
  });

  it("renders the booking CTA link with correct href", async () => {
    const html = await container.renderToString(CtaSection);
    const doc = new JSDOM(html).window.document;
    const link = doc.querySelector('a[href="/booking"]');
    expect(link).not.toBeNull();
    expect(link!.textContent?.trim()).toBe("Boka Din Städning");
  });

  it("renders the background image", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain('alt="Kitchen cleaning texture"');
  });

  it("applies the signature-gradient class", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain("signature-gradient");
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain("<section");
  });
});
