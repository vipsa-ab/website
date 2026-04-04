import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import Page404 from "@/pages/404.astro";

describe("404 Page", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the 404 display text", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("404");
  });

  it("renders the main h1 heading", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    const doc = new JSDOM(html).window.document;
    const h1 = doc.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent?.trim()).toBe(
      "Hoppsan! Sidan verkar ha tagit ledigt.",
    );
  });

  it("renders the description paragraph", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Precis som ett nystädat hem");
  });

  it("renders the home link", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain('href="/"');
  });

  it("renders the home link text", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Gå till startsidan");
  });

  it("renders the contact link", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain('href="/contact"');
  });

  it("renders the contact link text", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Kontakta oss");
  });

  it("renders the vacuum icon", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain('data-icon="material-symbols:vacuum"');
  });

  it("renders the Våra Tjänster suggestion card", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Våra Tjänster");
  });

  it("renders the Boka Städning suggestion card", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Boka Städning");
  });

  it("renders the Städguiden suggestion card", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Städguiden");
  });

  it("renders 3 suggestion card headings", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelectorAll("h3").length).toBeGreaterThanOrEqual(3);
  });

  it("includes the page title in the document", async () => {
    const html = await container.renderToString(Page404, { partial: false });
    expect(html).toContain("Vipsa | 404 | Sidan kunde inte hittas");
  });
});
