import { experimental_AstroContainer as AstroContainer } from "astro/container";
import reactSSR from "@astrojs/react/server.js";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import AboutPage from "@/pages/about.astro";

describe("About Page (integration with Layout)", () => {
  let container: AstroContainer;
  let html: string;
  let doc: Document;

  beforeEach(async () => {
    container = await AstroContainer.create();
    container.addServerRenderer({ renderer: reactSSR });
    html = await container.renderToString(AboutPage, { partial: false });
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
    expect(title?.textContent).toBe("Om Vipsa | Samma städare. Varje gång.");
  });

  it("sets the correct meta description", () => {
    const meta = doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toContain(
      "Lär känna Vipsa — din pålitliga partner",
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
    expect(html).toContain("Om Vipsa");
  });

  it("renders the HeroSection h1", () => {
    const h1 = doc.querySelector("main h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("Din partner för ett");
    expect(h1?.textContent).toContain("renare hem");
  });

  it("renders the HeroSection description", () => {
    expect(html).toContain("Vi skapar utrymme för livet");
  });

  it("renders the hero image", () => {
    expect(html).toContain('alt="Clean Nordic Living Room"');
  });

  // ── StorySection ─────────────────────────────────────────────────────────

  it("renders the StorySection heading", () => {
    expect(html).toContain("Vår Berättelse");
  });

  it("renders the StorySection story content", () => {
    expect(html).toContain("Vipsa föddes ur en enkel vision");
  });

  it("renders the Lagom emphasis", () => {
    const strong = doc.querySelector("main strong");
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe("Lagom");
  });

  it("renders the established year badge", () => {
    expect(html).toContain("Etablerat 2018");
  });

  it("renders the story image", () => {
    expect(html).toContain('alt="Sigtuna Team"');
  });

  // ── ValuesSection ────────────────────────────────────────────────────────

  it("renders the ValuesSection heading", () => {
    expect(html).toContain("Våra Värderingar");
  });

  it("renders all three values", () => {
    expect(html).toContain("Kvalitet");
    expect(html).toContain("Hållbarhet");
    expect(html).toContain("Pålitlighet");
  });

  it("renders values icons", () => {
    expect(html).toContain('data-icon="material-symbols:verified"');
    expect(html).toContain('data-icon="material-symbols:eco"');
    expect(html).toContain('data-icon="material-symbols:shield-with-heart"');
  });

  // ── TeamSection ──────────────────────────────────────────────────────────

  it("renders the TeamSection heading", () => {
    expect(html).toContain("Möt Vårt Team");
  });

  it("renders the TeamSection subtitle", () => {
    expect(html).toContain("Människorna bakom glansen i ditt hem");
  });

  it("renders all four team members", () => {
    expect(html).toContain("Elin Karlsson");
    expect(html).toContain("Johan Lindberg");
    expect(html).toContain("Sara Andersson");
    expect(html).toContain("Markus Berg");
  });

  it("renders team member roles", () => {
    expect(html).toContain("Fönsterspecialist");
    expect(html).toContain("Hållbarhetskoordinator");
    expect(html).toContain("Driftchef");
  });

  // ── CtaSection ───────────────────────────────────────────────────────────

  it("renders the CtaSection heading", () => {
    const h2s = doc.querySelectorAll("main h2");
    const headings = Array.from(h2s).map((h) => h.textContent?.trim());
    expect(headings).toContain("Vill du bli en del av vårt team?");
  });

  it("renders the CtaSection jobs link", () => {
    const link = doc.querySelector('main a[href="/services"]');
    expect(link).not.toBeNull();
    expect(link?.textContent?.trim()).toBe("Lediga tjänster");
  });

  it("renders the CtaSection booking link", () => {
    expect(html).toContain("Boka städning");
  });

  it("applies the signature gradient to CTA card", () => {
    expect(html).toContain("signature-gradient");
  });

  // ── Section ordering ─────────────────────────────────────────────────────

  it("renders sections in the correct order", () => {
    const heroPos = html.indexOf("Om Vipsa");
    const storyPos = html.indexOf("Vår Berättelse");
    const valuesPos = html.indexOf("Våra Värderingar");
    const teamPos = html.indexOf("Möt Vårt Team");
    const ctaPos = html.indexOf("Vill du bli en del av vårt team?");

    expect(heroPos).toBeLessThan(storyPos);
    expect(storyPos).toBeLessThan(valuesPos);
    expect(valuesPos).toBeLessThan(teamPos);
    expect(teamPos).toBeLessThan(ctaPos);
  });
});
