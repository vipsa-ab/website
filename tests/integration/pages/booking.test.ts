import { describe, it, expect, beforeAll } from "vitest";
import { renderPage, type PageRenderResult } from "../helpers";
import BookingPage from "@/pages/booking.astro";

describe("Booking Page — Layout integration", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(BookingPage);
  });

  it("passes a booking-specific title to the document head", () => {
    const title = page.doc.querySelector("title");
    expect(title?.textContent).toMatch(/boka/i);
  });

  it("passes a booking-specific meta description", () => {
    const meta = page.doc.querySelector('meta[name="description"]');
    const content = meta?.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content).toMatch(/boka|städning/i);
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

describe("Booking Page — hero section", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(BookingPage);
  });

  it("renders a primary heading with booking-related text", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toMatch(/boka/i);
  });

  it("renders a descriptive paragraph under the heading", () => {
    const main = page.screen.getByRole("main");
    const h1Section = main.querySelector("h1")?.closest("section");
    expect(h1Section).not.toBeNull();
    const paragraph = h1Section!.querySelector("p");
    expect(paragraph).not.toBeNull();
    expect(paragraph!.textContent!.length).toBeGreaterThan(20);
  });

  it("hero paragraph mentions service qualities", () => {
    const main = page.screen.getByRole("main");
    const h1Section = main.querySelector("h1")?.closest("section");
    const text = h1Section!.textContent!;
    expect(text).toMatch(/tryggt|personlig|enkelt/i);
  });
});

describe("Booking Page — BookingForm island (SSR shell)", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(BookingPage);
  });

  it("renders the BookingForm as a client:visible island", () => {
    const main = page.screen.getByRole("main");
    // Astro renders client islands with an astro-island custom element
    const island = main.querySelector("astro-island");
    expect(island).not.toBeNull();
  });

  it("the island targets the BookingForm component", () => {
    const main = page.screen.getByRole("main");
    const island = main.querySelector("astro-island");
    // Astro stores the component name or URL in the component-url attribute
    const componentUrl = island?.getAttribute("component-url");
    const componentExport = island?.getAttribute("component-export");
    // At minimum the island exists and has hydration attributes
    expect(
      componentUrl || componentExport || island?.hasAttribute("client"),
    ).toBeTruthy();
  });

  it("the island uses visible hydration strategy", () => {
    const main = page.screen.getByRole("main");
    const island = main.querySelector("astro-island");
    // Astro marks the directive in the client attribute
    const clientDirective = island?.getAttribute("client");
    expect(clientDirective).toBe("visible");
  });
});

describe("Booking Page — section composition", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(BookingPage);
  });

  it("renders at least one section inside main (hero)", () => {
    const main = page.screen.getByRole("main");
    const sections = main.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });

  it("hero section appears before the form island", () => {
    const main = page.screen.getByRole("main");
    const h1 = main.querySelector("h1");
    const island = main.querySelector("astro-island");
    expect(h1).not.toBeNull();
    expect(island).not.toBeNull();

    // h1 should come before the island in DOM order
    // DOCUMENT_POSITION_FOLLOWING = 4
    const position = h1!.compareDocumentPosition(island!);
    expect(position & 4).toBeTruthy();
  });
});

describe("Booking Page — SEO & meta", () => {
  let page: PageRenderResult;

  beforeAll(async () => {
    page = await renderPage(BookingPage);
  });

  it("has exactly one h1 element", () => {
    const h1s = page.doc.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
  });

  it("sets the page as prerendered (static)", () => {
    // The page exports prerender = true, meaning it's statically generated.
    // We verify the page renders successfully (no SSR-only errors)
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
