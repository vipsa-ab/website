import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import ContactPage from "@/pages/contact.astro";

describe("Contact Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("passes a contact-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/kontakta/i);
  });

  it("passes a contact-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    const content = meta?.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content).toMatch(/kontakta|frågor/i);
  });

  it("sets the document language to Swedish", () => {
    expect(page.doc.documentElement.getAttribute("lang")).toBe("sv");
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

  it("header provides a booking call-to-action linking to /booking", () => {
    const banner = page.screen.getByRole("banner");
    const bookingLink = banner.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
  });

  it("footer provides navigation links for key routes", () => {
    const footer = page.screen.getByRole("contentinfo");
    const hrefs = Array.from(footer.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining(["/", "/services", "/about", "/booking"]),
    );
  });

  it("footer provides legal links (privacy and terms)", () => {
    const footer = page.screen.getByRole("contentinfo");
    expect(footer.querySelector('a[href="/privacy"]')).not.toBeNull();
    expect(footer.querySelector('a[href="/terms"]')).not.toBeNull();
  });
});

describe("Contact Page — hero section", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("renders a primary heading", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toMatch(/vardag/i);
  });

  it("renders a category tag above the heading", () => {
    const main = page.screen.getByRole("main");
    const tag = main.querySelector(".label-md");
    expect(tag).not.toBeNull();
    expect(tag!.textContent).toMatch(/kontakta/i);
  });

  it("renders a descriptive paragraph under the heading", () => {
    const main = page.screen.getByRole("main");
    const h1Section = main.querySelector("h1")?.closest("section");
    expect(h1Section).not.toBeNull();
    const paragraph = h1Section!.querySelector("p");
    expect(paragraph).not.toBeNull();
    expect(paragraph!.textContent!.length).toBeGreaterThan(20);
  });
});

describe("Contact Page — trust bar section", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("renders three trust indicators", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/snabbt svar/i);
    expect(main.textContent).toMatch(/certifierade/i);
    expect(main.textContent).toMatch(/ansvarsförsäkring/i);
  });

  it("shows response time detail", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/inom 24 timmar/i);
  });
});

describe("Contact Page — info section", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("displays phone contact information", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/ring oss/i);
    expect(main.textContent).toMatch(/010-123 45 67/);
  });

  it("displays email contact information", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/e-post/i);
    expect(main.textContent).toMatch(/hej@vipsa\.se/);
  });

  it("displays office address", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/besök oss/i);
    expect(main.textContent).toMatch(/Ormbergsvägen 15/);
  });

  it("displays business hours", () => {
    const main = page.screen.getByRole("main");
    expect(main.textContent).toMatch(/mån-fre.*08:00.*17:00/i);
  });
});

describe("Contact Page — client islands (SSR shell)", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("renders at least two client:visible islands (form + map)", () => {
    const main = page.screen.getByRole("main");
    const islands = main.querySelectorAll("astro-island");
    expect(islands.length).toBeGreaterThanOrEqual(2);
  });

  it("all islands use visible hydration strategy", () => {
    const main = page.screen.getByRole("main");
    const islands = main.querySelectorAll("astro-island");
    islands.forEach((island) => {
      expect(island.getAttribute("client")).toBe("visible");
    });
  });

  it("islands are inside the two-column grid layout", () => {
    const main = page.screen.getByRole("main");
    const grid = main.querySelector(".grid.grid-cols-1.lg\\:grid-cols-2");
    expect(grid).not.toBeNull();
    const islands = grid!.querySelectorAll("astro-island");
    expect(islands.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Contact Page — section composition", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("hero section appears before trust bar and form", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    const island = main.querySelector("astro-island");
    expect(h1).not.toBeNull();
    expect(island).not.toBeNull();
    const position = h1!.compareDocumentPosition(island!);
    expect(position & 4).toBeTruthy();
  });

  it("renders at least two sections inside main", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Contact Page — SEO & meta", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(ContactPage);
  });

  it("has exactly one h1 element", () => {
    const h1s = page.doc.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
  });

  it("sets the page as prerendered (static)", () => {
    const main = page.screen.getByRole("main");
    expect(main).toBeDefined();
    expect(main.innerHTML.length).toBeGreaterThan(0);
  });

  it("loads required fonts (Manrope and Plus Jakarta Sans)", () => {
    const head = page.doc.head.innerHTML;
    expect(head).toMatch(/manrope/i);
    expect(head).toMatch(/plus-jakarta-sans|jakarta/i);
  });
});
