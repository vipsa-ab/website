import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import HowItWorkSection from "@/components/landing/HowItWorkSection.astro";

describe("HowItWorkSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(HowItWorkSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent?.trim()).toBe("Hur det fungerar");
  });

  it("renders the subheading", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain("Enkelhet är kärnan i vår service.");
  });

  it("renders exactly 3 steps", async () => {
    const html = await container.renderToString(HowItWorkSection);
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelectorAll("h3")).toHaveLength(3);
  });

  it("renders step 1 title", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain("1. Boka");
  });

  it("renders step 2 title", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain("2. Vi städar");
  });

  it("renders step 3 title", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain("3. Njut av renheten");
  });

  it("renders the calendar icon for step 1", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain('data-icon="material-symbols:calendar-month"');
  });

  it("renders the cleaning-services icon for step 2", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain('data-icon="material-symbols:cleaning-services"');
  });

  it("renders the satisfaction icon for step 3", async () => {
    const html = await container.renderToString(HowItWorkSection);
    expect(html).toContain(
      'data-icon="material-symbols:sentiment-very-satisfied"',
    );
  });

  it("renders step descriptions", async () => {
    const html = await container.renderToString(HowItWorkSection);
    const normalizedHtml = html.replace(/\s+/g, " ");
    expect(normalizedHtml).toContain("Det tar mindre än");
    expect(normalizedHtml).toContain("högsta precision");
    expect(normalizedHtml).toContain("det du älskar mest");
  });
});
