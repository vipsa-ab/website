import { experimental_AstroContainer as AstroContainer } from "astro/container";
import reactSSR from "@astrojs/react/server.js";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import FaqSection from "@/components/services/FaqSection.astro";

describe("FaqSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
    container.addServerRenderer({ renderer: reactSSR });
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(FaqSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toContain("Vanliga frågor");
  });

  it("renders the subtitle", async () => {
    const html = await container.renderToString(FaqSection);
    expect(html).toContain("Här hittar du svar på de vanligaste funderingarna");
  });

  it("renders all four FAQ questions", async () => {
    const html = await container.renderToString(FaqSection);
    expect(html).toContain("Ingår städmaterial i priset?");
    expect(html).toContain("Är ni försäkrade?");
    expect(html).toContain("Hur fungerar RUT-avdraget?");
    expect(html).toContain("Vad händer om jag inte är nöjd?");
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(FaqSection);
    expect(html).toContain("<section");
  });
});
