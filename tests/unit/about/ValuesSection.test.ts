import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import ValuesSection from "@/components/about/ValuesSection.astro";

describe("About ValuesSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(ValuesSection);
    expect(html).toContain("<section");
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(ValuesSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toBe("Våra Värderingar");
  });

  it("renders the decorative divider", async () => {
    const html = await container.renderToString(ValuesSection);
    const doc = new JSDOM(html).window.document;
    const divider = doc.querySelector(".bg-primary.h-1.w-20");
    expect(divider).not.toBeNull();
  });

  it("renders all three value cards", async () => {
    const html = await container.renderToString(ValuesSection);
    const doc = new JSDOM(html).window.document;
    const headings = doc.querySelectorAll("h3");
    expect(headings).toHaveLength(3);
    expect(headings[0].textContent).toBe("Kvalitet");
    expect(headings[1].textContent).toBe("Hållbarhet");
    expect(headings[2].textContent).toBe("Pålitlighet");
  });

  it("renders the Kvalitet value description", async () => {
    const html = await container.renderToString(ValuesSection);
    expect(html).toContain("Vi nöjer oss inte med");
  });

  it("renders the Hållbarhet value description", async () => {
    const html = await container.renderToString(ValuesSection);
    expect(html).toContain("Svanenmärkta produkter");
  });

  it("renders the Pålitlighet value description", async () => {
    const html = await container.renderToString(ValuesSection);
    expect(html).toContain("Samma personal, samma tid, samma höga standard");
  });

  it("renders icons for each value", async () => {
    const html = await container.renderToString(ValuesSection);
    expect(html).toContain('data-icon="material-symbols:verified"');
    expect(html).toContain('data-icon="material-symbols:eco"');
    expect(html).toContain('data-icon="material-symbols:shield-with-heart"');
  });
});
