import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import TestimonialsSection from "@/components/landing/TestimonialsSection.astro";

describe("TestimonialsSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(TestimonialsSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent?.trim()).toBe("Vad våra kunder säger");
  });

  it("renders Anna Svensson's testimonial", async () => {
    const html = await container.renderToString(TestimonialsSection);
    expect(html).toContain("Anna Svensson");
  });

  it("renders Erik Johansson's testimonial", async () => {
    const html = await container.renderToString(TestimonialsSection);
    expect(html).toContain("Erik Johansson");
  });

  it("renders Maria Andersson's testimonial", async () => {
    const html = await container.renderToString(TestimonialsSection);
    expect(html).toContain("Maria Andersson");
  });

  it("renders correct customer titles", async () => {
    const html = await container.renderToString(TestimonialsSection);
    expect(html).toContain("Villaägare i Solna");
    expect(html).toContain("Lägenhet i Östermalm");
    expect(html).toContain("Restaurangägare");
  });

  it("renders exactly 3 testimonial images", async () => {
    const html = await container.renderToString(TestimonialsSection);
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelectorAll("img")).toHaveLength(3);
  });

  it("renders all 15 filled stars (3 cards × rating 5)", async () => {
    const html = await container.renderToString(TestimonialsSection);
    const filledStarMatches = html.match(/data-icon="material-symbols:star"/g);
    expect(filledStarMatches).toHaveLength(15);
  });

  it("renders zero empty stars (all ratings are 5)", async () => {
    const html = await container.renderToString(TestimonialsSection);
    expect(html).not.toContain('data-icon="material-symbols:star-outline"');
  });
});
