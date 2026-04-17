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

  it("displays a RUT-avdrag badge alongside the CTA", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/50% RUT-avdrag ingår/);
  });
});

describe("Pricing Page — pricing section (other services)", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders the section heading", () => {
    const main = page.screen.getByRole("main");
    const h2s = Array.from(main.querySelectorAll("h2")).map((h) =>
      h.textContent?.trim(),
    );
    expect(h2s).toContain("Priser för övriga tjänster");
  });

  it("renders four service cards with headings", () => {
    const main = page.screen.getByRole("main");
    const h3s = Array.from(main.querySelectorAll("h3")).map((h) =>
      h.textContent?.trim(),
    );
    expect(h3s).toContain("Flyttstädning");
    expect(h3s).toContain("Stor- & Byggstädning");
    expect(h3s).toContain("Kontorsstädning");
    expect(h3s).toContain("Trappstädning");
  });

  it("shows price for flyttstädning and kontorsstädning", () => {
    const main = page.screen.getByRole("main");
    const html = main.innerHTML;
    expect(html).toMatch(/1\s*490\s*kr/);
    expect(html).toMatch(/245\s*kr\/tim/);
  });

  it("shows offert button for trappstädning", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/Begär offert baserat på storlek/);
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
    expect(headings).toContain("Beräkna ditt pris för hemstädning");
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

describe("Pricing Page — other services (tilläggstjänster)", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders the tilläggstjänster heading", () => {
    const main = page.screen.getByRole("main");
    const h2s = Array.from(main.querySelectorAll("h2")).map((h) =>
      h.textContent?.trim(),
    );
    expect(h2s).toContain("Tilläggstjänster");
  });

  it("lists three add-on services with prices", () => {
    const main = page.screen.getByRole("main");
    const h4s = Array.from(main.querySelectorAll("h4")).map((h) =>
      h.textContent?.trim(),
    );
    expect(h4s).toContain("Fönsterputsning");
    expect(h4s).toContain("Strykning");
    expect(h4s).toContain("Trädgårdsarbete");
  });

  it("shows hourly rates for add-on services", () => {
    const main = page.screen.getByRole("main");
    const html = main.innerHTML;
    expect(html).toMatch(/195\s*kr\/tim/);
    expect(html).toMatch(/225\s*kr\/tim/);
    expect(html).toMatch(/299\s*kr\/tim/);
  });
});

describe("Pricing Page — section composition", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(PricingPage);
  });

  it("renders all six content sections inside main", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(6);
  });

  it("sections follow the correct visual order (hero → calculator → pricing → other services → RUT → FAQ)", () => {
    const main = page.screen.getByRole("main");
    const headings = Array.from(main.querySelectorAll("h1, h2")).map((h) =>
      h.textContent?.trim(),
    );
    const heroIdx = headings.findIndex((h) =>
      h?.match(/pris.*transparent|transparenta.*pris/i),
    );
    const calculatorIdx = headings.indexOf("Beräkna ditt pris för hemstädning");
    const pricingIdx = headings.indexOf("Priser för övriga tjänster");
    const otherServicesIdx = headings.indexOf("Tilläggstjänster");
    const rutIdx = headings.indexOf("Så fungerar RUT-avdraget");
    const faqIdx = headings.indexOf("Vanliga frågor om priser");

    expect(heroIdx).toBeLessThan(calculatorIdx);
    expect(calculatorIdx).toBeLessThan(pricingIdx);
    expect(pricingIdx).toBeLessThan(otherServicesIdx);
    expect(otherServicesIdx).toBeLessThan(rutIdx);
    expect(rutIdx).toBeLessThan(faqIdx);
  });
});
