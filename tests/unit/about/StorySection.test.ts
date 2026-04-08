import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import StorySection from "@/components/about/StorySection.astro";

describe("About StorySection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(StorySection);
    expect(html).toContain("<section");
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(StorySection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent?.trim()).toBe("Vår Berättelse");
  });

  it("renders the story paragraphs", async () => {
    const html = await container.renderToString(StorySection);
    expect(html).toContain("Vipsa föddes ur en enkel vision");
    expect(html).toContain("Våra rötter sträcker sig djupt");
  });

  it("renders the Lagom emphasis in bold", async () => {
    const html = await container.renderToString(StorySection);
    const doc = new JSDOM(html).window.document;
    const strong = doc.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong!.textContent).toBe("Lagom");
  });

  it("renders the team image with correct alt", async () => {
    const html = await container.renderToString(StorySection);
    expect(html).toContain('alt="Sigtuna Team"');
  });

  it("renders the established year decorative element", async () => {
    const html = await container.renderToString(StorySection);
    expect(html).toContain("Etablerat 2018");
  });
});
