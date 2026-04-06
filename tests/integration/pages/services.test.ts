import { experimental_AstroContainer as AstroContainer } from "astro/container";
import reactSSR from "@astrojs/react/server.js";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import ServicesPage from "@/pages/services/index.astro";

describe("Services Page (integration with Layout)", () => {
  let container: AstroContainer;
  let html: string;
  let doc: Document;

  beforeEach(async () => {
    container = await AstroContainer.create();
    container.addServerRenderer({ renderer: reactSSR });
    html = await container.renderToString(ServicesPage, { partial: false });
    doc = new JSDOM(html).window.document;
  });

  // ── HTML document structure ──────────────────────────────────────────────

  it("renders a complete HTML document", () => {
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("sets the lang attribute to Swedish", () => {
    const htmlEl = doc.querySelector("html");
    expect(htmlEl?.getAttribute("lang")).toBe("sv");
  });

  it("includes a <head> with charset UTF-8", () => {
    expect(doc.querySelector('meta[charset="UTF-8"]')).not.toBeNull();
  });

  it("includes the viewport meta tag", () => {
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull();
  });

  it("sets the correct page title", () => {
    const title = doc.querySelector("title");
    expect(title?.textContent).toBe("Vipsa | Tjänster");
  });

  it("sets the correct meta description", () => {
    const meta = doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toContain(
      "Utforska våra professionella städtjänster i Stockholm",
    );
  });

  // ── Layout: Header ───────────────────────────────────────────────────────

  it("renders the header inside the document", () => {
    expect(doc.querySelector("header")).not.toBeNull();
  });

  it("renders the home nav link from the Header", () => {
    const homeLink = doc.querySelector('a[aria-label="Gå till startsidan"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.getAttribute("href")).toBe("/");
  });

  it("renders all main navigation links from the Header", () => {
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

  it("renders the Header booking CTA", () => {
    const bookingLink = doc.querySelector('header a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
    expect(bookingLink?.textContent?.trim()).toBe("Boka Nu");
  });

  it("renders the mobile menu trigger button", () => {
    expect(html).toContain('aria-label="Öppna navigationsmeny"');
  });

  // ── Layout: Footer ───────────────────────────────────────────────────────

  it("renders the footer inside the document", () => {
    expect(doc.querySelector("footer")).not.toBeNull();
  });

  it("renders the Footer brand description", () => {
    expect(html).toContain(
      "Din lokala partner för ett renare hem och en enklare vardag i Sigtuna.",
    );
  });

  it("renders the Footer contact section with address", () => {
    expect(html).toContain("Ormbergsvägen 15");
    expect(html).toContain("193 36 Sigtuna");
  });

  it("renders the Footer copyright notice", () => {
    expect(html).toContain(
      `© ${new Date().getFullYear()} Vipsa AB. All rights reserved.`,
    );
  });

  it("renders the Footer privacy and terms links", () => {
    expect(doc.querySelector('footer a[href="/privacy"]')).not.toBeNull();
    expect(doc.querySelector('footer a[href="/terms"]')).not.toBeNull();
  });

  // ── Layout: <main> wraps page content ────────────────────────────────────

  it("wraps page sections inside <main>", () => {
    const main = doc.querySelector("main");
    expect(main).not.toBeNull();
    expect(main?.querySelector("section")).not.toBeNull();
  });

  // ── Page content: all five sections render ───────────────────────────────

  it("renders exactly five <section> elements inside <main>", () => {
    const sections = doc.querySelectorAll("main section");
    expect(sections.length).toBe(5);
  });

  // ── HeroSection ──────────────────────────────────────────────────────────

  it("renders the HeroSection label", () => {
    expect(html).toContain("Välkommen till en renare vardag");
  });

  it("renders the HeroSection h1", () => {
    const h1 = doc.querySelector("main h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("Våra Tjänster");
  });

  it("renders the HeroSection booking CTA", () => {
    const link = doc.querySelector('main a[href="/booking"]');
    expect(link).not.toBeNull();
    expect(link?.textContent?.trim()).toBe("Boka städning");
  });

  it("renders the HeroSection pricing CTA", () => {
    const link = doc.querySelector('main a[href="/pricing"]');
    expect(link).not.toBeNull();
    expect(link?.textContent?.trim()).toBe("Se priser");
  });

  it("renders the hero image", () => {
    expect(html).toContain('alt="Ren lägenhet"');
  });

  it("renders the guarantee card", () => {
    expect(html).toContain("100% Nöjd-kund-garanti");
  });

  // ── ServicesSection ──────────────────────────────────────────────────────

  it("renders the ServicesSection heading", () => {
    expect(html).toContain("Skräddarsydda lösningar för alla behov");
  });

  it("renders all four service cards", () => {
    expect(html).toContain("Hemstädning");
    expect(html).toContain("Flyttstädning");
    expect(html).toContain("Kontorsstädning");
    expect(html).toContain("Fönsterputs");
  });

  it("renders service card features", () => {
    expect(html).toContain("Valfri frekvens (vecka/månad)");
    expect(html).toContain("Garanti på besiktning");
    expect(html).toContain("Anpassat efter kontorstider");
    expect(html).toContain("RUT-avdrag för privatpersoner");
  });

  // ── PricingSection ───────────────────────────────────────────────────────

  it("renders the PricingSection heading", () => {
    expect(html).toContain("Enkla och transparenta priser");
  });

  it("renders the RUT disclaimer", () => {
    expect(html).toContain("Alla priser är efter 50% RUT-avdrag");
  });

  it("renders all three pricing tiers", () => {
    const h4s = doc.querySelectorAll("h4");
    const tierNames = Array.from(h4s).map((h) => h.textContent?.trim());
    expect(tierNames).toContain("Hemstädning Bas");
    expect(tierNames).toContain("Hemstädning Premium");
    expect(tierNames).toContain("Flyttstädning");
  });

  it("renders pricing amounts", () => {
    expect(html).toContain("195 kr");
    expect(html).toContain("225 kr");
    expect(html).toContain("fr. 1 490 kr");
  });

  it("renders the Mest Populär badge", () => {
    expect(html).toContain("Mest Populär");
  });

  it("renders pricing CTA buttons", () => {
    const buttons = doc.querySelectorAll("main button");
    const labels = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(labels).toContain("Välj Bas");
    expect(labels).toContain("Välj Premium");
    expect(labels).toContain("Få Offert");
  });

  // ── FaqSection ───────────────────────────────────────────────────────────

  it("renders the FaqSection heading", () => {
    expect(html).toContain("Vanliga frågor");
  });

  it("renders all four FAQ questions", () => {
    expect(html).toContain("Ingår städmaterial i priset?");
    expect(html).toContain("Är ni försäkrade?");
    expect(html).toContain("Hur fungerar RUT-avdraget?");
    expect(html).toContain("Vad händer om jag inte är nöjd?");
  });

  // ── CtaSection ───────────────────────────────────────────────────────────

  it("renders the CtaSection heading", () => {
    const h2s = doc.querySelectorAll("main h2");
    const headings = Array.from(h2s).map((h) => h.textContent?.trim());
    expect(headings).toContain("Redo för en renare vardag?");
  });

  it("renders the CtaSection booking link", () => {
    expect(html).toContain("Boka Din Städning");
  });

  it("renders the CtaSection background image", () => {
    expect(html).toContain('alt="Kitchen cleaning texture"');
  });

  // ── Section ordering ─────────────────────────────────────────────────────

  it("renders sections in the correct order", () => {
    const heroPos = html.indexOf("Våra Tjänster");
    const servicesPos = html.indexOf("Skräddarsydda lösningar");
    const pricingPos = html.indexOf("Enkla och transparenta priser");
    const faqPos = html.indexOf("Vanliga frågor");
    const ctaPos = html.indexOf("Redo för en renare vardag?");

    expect(heroPos).toBeLessThan(servicesPos);
    expect(servicesPos).toBeLessThan(pricingPos);
    expect(pricingPos).toBeLessThan(faqPos);
    expect(faqPos).toBeLessThan(ctaPos);
  });
});
