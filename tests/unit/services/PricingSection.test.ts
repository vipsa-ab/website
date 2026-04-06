import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import PricingSection from "@/components/services/PricingSection.astro";

describe("PricingSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(PricingSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toContain("Enkla och transparenta priser");
  });

  it("renders the RUT-avdrag disclaimer", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("Alla priser är efter 50% RUT-avdrag");
  });

  it("renders all three pricing cards", async () => {
    const html = await container.renderToString(PricingSection);
    const doc = new JSDOM(html).window.document;
    const h4s = doc.querySelectorAll("h4");
    expect(h4s.length).toBe(3);
    expect(h4s[0].textContent?.trim()).toBe("Hemstädning Bas");
    expect(h4s[1].textContent?.trim()).toBe("Hemstädning Premium");
    expect(h4s[2].textContent?.trim()).toBe("Flyttstädning");
  });

  it("renders the Bas price", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("195 kr");
  });

  it("renders the Premium price", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("225 kr");
  });

  it("renders the Flytt starting price", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("fr. 1 490 kr");
  });

  it("renders the 'Mest Populär' badge on Premium", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("Mest Populär");
  });

  it("renders Bas features", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("Standard städning av alla rum");
    expect(html).toContain("Våttorkning av golv");
  });

  it("renders Premium features", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("Allt i Bas-paketet");
    expect(html).toContain("Kylskåpsrengöring");
    expect(html).toContain("Bäddning av sängar");
  });

  it("renders Flytt features", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("Komplett genomgång av bostad");
    expect(html).toContain("Garantibesiktning");
  });

  it("renders CTA buttons for each card", async () => {
    const html = await container.renderToString(PricingSection);
    const doc = new JSDOM(html).window.document;
    const buttons = doc.querySelectorAll("button");
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent?.trim()).toBe("Välj Bas");
    expect(buttons[1].textContent?.trim()).toBe("Välj Premium");
    expect(buttons[2].textContent?.trim()).toBe("Få Offert");
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(PricingSection);
    expect(html).toContain("<section");
  });
});
