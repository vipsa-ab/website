import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import ServicesSection from "@/components/services/ServicesSection.astro";

describe("ServicesSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(ServicesSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toContain("Skräddarsydda lösningar för alla behov");
  });

  it("renders the signature gradient divider", async () => {
    const html = await container.renderToString(ServicesSection);
    expect(html).toContain("signature-gradient");
  });

  it("renders all four service cards", async () => {
    const html = await container.renderToString(ServicesSection);
    expect(html).toContain("Hemstädning");
    expect(html).toContain("Flyttstädning");
    expect(html).toContain("Kontorsstädning");
    expect(html).toContain("Fönsterputs");
  });

  it("renders service descriptions", async () => {
    const html = await container.renderToString(ServicesSection);
    expect(html).toContain("Ge dig själv gåvan av tid");
    expect(html).toContain("Fokusera på ditt nya hem");
    expect(html).toContain("Ett rent kontor är ett produktivt kontor");
    expect(html).toContain("Släpp in ljuset");
  });

  it("renders service features", async () => {
    const html = await container.renderToString(ServicesSection);
    expect(html).toContain("Valfri frekvens (vecka/månad)");
    expect(html).toContain("Garanti på besiktning");
    expect(html).toContain("Anpassat efter kontorstider");
    expect(html).toContain("RUT-avdrag för privatpersoner");
  });

  it("renders the correct service icons", async () => {
    const html = await container.renderToString(ServicesSection);
    expect(html).toContain('data-icon="material-symbols:house-rounded"');
    expect(html).toContain('data-icon="material-symbols:local-shipping"');
    expect(html).toContain('data-icon="material-symbols:corporate-fare"');
    expect(html).toContain('data-icon="material-symbols:wb-sunny"');
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(ServicesSection);
    expect(html).toContain("<section");
  });
});
