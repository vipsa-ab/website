import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import PricingPage from "@/pages/pricing.astro";

describe("Pricing Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("passes a pricing-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/fakturering|betalning/i);
  });

  it("passes a pricing-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBeTruthy();
  });

  it("assembles header, main, and footer landmarks", () => {
    expect(page.screen.getByRole("banner")).toBeDefined();
    expect(page.screen.getByRole("main")).toBeDefined();
    expect(page.screen.getByRole("contentinfo")).toBeDefined();
  });

  it("header navigation includes links to all main routes", () => {
    const nav = page.screen.getByRole("banner").querySelector("nav");
    const hrefs = Array.from(nav!.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/",
        "/services",
        "/about",
        "/pricing",
        "/contact",
      ]),
    );
  });
});

describe("Pricing Page — hero section", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders a primary heading", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toMatch(/pris/i);
  });

  it("mentions the RUT-avdrag benefit in the hero", () => {
    const main = page.screen.getByRole("main");
    const h1Section = main.querySelector("h1")?.closest("section");
    expect(h1Section?.textContent).toMatch(/RUT/i);
  });

  it("displays trust badges (ansvarsförsäkrade, ingen bindningstid)", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/Ansvarsförsäkrade/);
    expect(main.textContent).toMatch(/Ingen bindningstid/);
  });
});

describe("Pricing Page — pricing tiers", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders three pricing tier headings", () => {
    const main = page.screen.getByRole("main");
    const h3s = Array.from(main.querySelectorAll("h3")).map((h) =>
      h.textContent?.trim(),
    );
    expect(h3s).toContain("Hemstädning");
    expect(h3s).toContain("Flyttstädning");
    expect(h3s).toContain("Kontorsstädning");
  });

  it("shows price amounts for hemstädning and flyttstädning", () => {
    const main = page.screen.getByRole("main");
    const html = main.innerHTML;
    expect(html).toMatch(/195\s*kr/);
    expect(html).toMatch(/1\s*490\s*kr/);
  });

  it("shows 'Offert' for kontorsstädning instead of a fixed price", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/Offert/);
  });

  it("highlights flyttstädning as most popular", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/Mest populär/i);
  });

  it("each pricing tier has a CTA button", () => {
    const main = page.screen.getByRole("main");
    const buttons = Array.from(main.querySelectorAll("button"));
    const ctaLabels = buttons.map((b) => b.textContent?.trim());
    expect(ctaLabels).toContain("Boka Hemstäd");
    expect(ctaLabels).toContain("Boka Flyttstäd");
    expect(ctaLabels).toContain("Begär Offert");
  });

  it("each pricing tier lists feature items", () => {
    const main = page.screen.getByRole("main");
    const lists = main.querySelectorAll("ul");
    expect(lists.length).toBeGreaterThanOrEqual(3);
    for (const list of lists) {
      expect(list.querySelectorAll("li").length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Pricing Page — calculator section (SSR shell)", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders the calculator section with its heading", () => {
    const main = page.screen.getByRole("main");
    const headings = Array.from(main.querySelectorAll("h2")).map((h) =>
      h.textContent?.trim(),
    );
    expect(headings).toContain("Beräkna ditt pris");
  });
});

describe("Pricing Page — RUT-avdrag explanation", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders a heading explaining the RUT-avdrag", () => {
    const main = page.screen.getByRole("main");
    const headings = Array.from(main.querySelectorAll("h2")).map((h) =>
      h.textContent?.trim(),
    );
    expect(headings).toContain("Så fungerar RUT-avdraget");
  });

  it("includes the example calculation breakdown", () => {
    const main = page.screen.getByRole("main");
    const text = main.textContent!;
    expect(text).toMatch(/Arbetskostnad/);
    expect(text).toMatch(/RUT-avdrag/);
    expect(text).toMatch(/Din kostnad/);
  });

  it("shows the 50% discount and direktavdrag benefits", () => {
    const main = page.screen.getByRole("main");
    const text = main.textContent!;
    expect(text).toMatch(/50%/);
    expect(text).toMatch(/Direktavdrag/);
  });
});

describe("Pricing Page — FAQ section", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders the FAQ heading", () => {
    const main = page.screen.getByRole("main");
    const headings = Array.from(main.querySelectorAll("h2")).map((h) =>
      h.textContent?.trim(),
    );
    expect(headings).toContain("Vanliga frågor om priser");
  });

  it("renders FAQ interactive buttons for each question", () => {
    const main = page.screen.getByRole("main");
    const buttons = Array.from(main.querySelectorAll("button"));
    const faqButtons = buttons.filter(
      (b) => (b.textContent?.trim().length ?? 0) > 20,
    );
    expect(faqButtons.length).toBeGreaterThanOrEqual(3);
  });

  it("includes pricing-related FAQ topics", () => {
    const main = page.screen.getByRole("main");
    const text = main.textContent!;
    expect(text).toMatch(/resekostnader/i);
    expect(text).toMatch(/städmaterial/i);
    expect(text).toMatch(/betalningen/i);
  });
});

describe("Pricing Page — section composition", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders all five content sections inside main", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(5);
  });

  it("sections follow the correct visual order (hero → pricing → calculator → RUT → FAQ)", () => {
    const main = page.screen.getByRole("main");
    const headings = Array.from(main.querySelectorAll("h1, h2")).map((h) =>
      h.textContent?.trim(),
    );
    const heroIdx = headings.findIndex((h) =>
      h?.match(/pris.*transparent|transparenta.*pris/i),
    );
    const pricingIdx = headings.findIndex((_, i) => i > heroIdx);
    const calculatorIdx = headings.indexOf("Beräkna ditt pris");
    const rutIdx = headings.indexOf("Så fungerar RUT-avdraget");
    const faqIdx = headings.indexOf("Vanliga frågor om priser");

    expect(heroIdx).toBeLessThan(calculatorIdx);
    expect(calculatorIdx).toBeLessThan(rutIdx);
    expect(rutIdx).toBeLessThan(faqIdx);
  });
});
