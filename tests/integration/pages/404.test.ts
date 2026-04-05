import { experimental_AstroContainer as AstroContainer } from "astro/container";
import reactSSR from "@astrojs/react/server.js";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import Page404 from "@/pages/404.astro";

describe("404 Page (integration with Layout)", () => {
  let container: AstroContainer;
  let html: string;
  let doc: Document;

  beforeEach(async () => {
    container = await AstroContainer.create();
    container.addServerRenderer({ renderer: reactSSR });
    html = await container.renderToString(Page404, { partial: false });
    doc = new JSDOM(html).window.document;
  });

  // ── HTML document structure ──────────────────────────────────────────────

  it("renders a complete HTML document", async () => {
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("sets the lang attribute to Swedish", async () => {
    expect(doc.querySelector("html")?.getAttribute("lang")).toBe("sv");
  });

  it("includes a <head> with charset UTF-8", async () => {
    expect(doc.querySelector('meta[charset="UTF-8"]')).not.toBeNull();
  });

  it("includes the viewport meta tag", async () => {
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull();
  });

  it("sets the correct page title", async () => {
    expect(doc.querySelector("title")?.textContent).toBe(
      "Vipsa | 404 | Sidan kunde inte hittas",
    );
  });

  it("sets the correct meta description", async () => {
    const meta = doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toContain(
      "Den sida du letar efter kunde inte hittas",
    );
  });

  // ── Layout: Header ───────────────────────────────────────────────────────

  it("renders the Header", async () => {
    expect(doc.querySelector("header")).not.toBeNull();
  });

  it("renders the Header logo link", async () => {
    const logoLink = doc.querySelector('a[aria-label="Gå till startsidan"]');
    expect(logoLink).not.toBeNull();
    expect(logoLink?.getAttribute("href")).toBe("/");
  });

  it("renders all Header navigation links", async () => {
    const navLinks = Array.from(doc.querySelectorAll("nav a")).map((a) => ({
      href: a.getAttribute("href"),
      text: a.textContent?.trim(),
    }));

    expect(navLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/", text: "Hem" }),
        expect.objectContaining({ href: "/services", text: "Tjänster" }),
        expect.objectContaining({ href: "/about", text: "Om Oss" }),
        expect.objectContaining({ href: "/pricing", text: "Prislista" }),
        expect.objectContaining({ href: "/contact", text: "Kontakt" }),
      ]),
    );
  });

  it("renders the Header booking CTA", async () => {
    const bookingLink = doc.querySelector('header a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
    expect(bookingLink?.textContent?.trim()).toBe("Boka Nu");
  });

  it("renders the mobile menu trigger button", async () => {
    expect(html).toContain('aria-label="Öppna navigationsmeny"');
  });

  // ── Layout: Footer ───────────────────────────────────────────────────────

  it("renders the Footer", async () => {
    expect(doc.querySelector("footer")).not.toBeNull();
  });

  it("renders the Footer brand description", async () => {
    expect(html).toContain(
      "Din lokala partner för ett renare hem och en enklare vardag i Sigtuna.",
    );
  });

  it("renders the Footer contact info", async () => {
    expect(html).toContain("info@vipsa.se");
    expect(html).toContain("08-123 45 67");
  });

  it("renders the Footer copyright notice", async () => {
    expect(html).toContain(
      `© ${new Date().getFullYear()} Vipsa AB. All rights reserved.`,
    );
  });

  it("renders the Footer legal links", async () => {
    expect(doc.querySelector('footer a[href="/privacy"]')).not.toBeNull();
    expect(doc.querySelector('footer a[href="/terms"]')).not.toBeNull();
  });

  // ── Layout: <main> wraps page content ────────────────────────────────────

  it("renders page content inside <main>", async () => {
    const main = doc.querySelector("main");
    expect(main).not.toBeNull();
    expect(main?.querySelector("section")).not.toBeNull();
  });

  // ── 404 page content ─────────────────────────────────────────────────────

  it("renders the 404 display text", async () => {
    expect(html).toContain("404");
  });

  it("renders the main h1 heading", async () => {
    const h1 = doc.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.trim()).toBe(
      "Hoppsan! Sidan verkar ha tagit ledigt.",
    );
  });

  it("renders the description paragraph", async () => {
    expect(html).toContain("Precis som ett nystädat hem");
  });

  it("renders the vacuum icon", async () => {
    expect(html).toContain('data-icon="material-symbols:vacuum"');
  });

  it("renders the home CTA link", async () => {
    const main = doc.querySelector("main");
    const homeLink = main?.querySelector('a[href="/"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.textContent).toContain("Gå till startsidan");
  });

  it("renders the contact CTA link", async () => {
    const main = doc.querySelector("main");
    const contactLink = main?.querySelector('a[href="/contact"]');
    expect(contactLink).not.toBeNull();
    expect(contactLink?.textContent).toContain("Kontakta oss");
  });

  it("renders the three suggestion cards", async () => {
    const h3s = Array.from(doc.querySelectorAll("main h3")).map((h) =>
      h.textContent?.trim(),
    );
    expect(h3s).toContain("Våra Tjänster");
    expect(h3s).toContain("Boka Städning");
    expect(h3s).toContain("Städguiden");
  });
});
