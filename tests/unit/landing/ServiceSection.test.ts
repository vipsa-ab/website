import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import ServiceSection from "@/components/landing/ServiceSection.astro";

describe("ServiceSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(ServiceSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent?.trim()).toBe("Våra Tjänster");
  });

  it("renders exactly 3 service cards", async () => {
    const html = await container.renderToString(ServiceSection);
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelectorAll("h3")).toHaveLength(3);
  });

  it("renders Hemstädning service", async () => {
    const html = await container.renderToString(ServiceSection);
    expect(html).toContain("Hemstädning");
  });

  it("renders Flyttstädning service", async () => {
    const html = await container.renderToString(ServiceSection);
    expect(html).toContain("Flyttstädning");
  });

  it("renders Kontorsstädning service", async () => {
    const html = await container.renderToString(ServiceSection);
    expect(html).toContain("Kontorsstädning");
  });

  it("renders link to home-cleaning service", async () => {
    const html = await container.renderToString(ServiceSection);
    expect(html).toContain('href="/services/home-cleaning"');
  });

  it("renders link to move-cleaning service", async () => {
    const html = await container.renderToString(ServiceSection);
    expect(html).toContain('href="/services/move-cleaning"');
  });

  it("renders link to office-cleaning service", async () => {
    const html = await container.renderToString(ServiceSection);
    expect(html).toContain('href="/services/office-cleaning"');
  });

  it("renders exactly 3 service images", async () => {
    const html = await container.renderToString(ServiceSection);
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelectorAll("img")).toHaveLength(3);
  });
});
