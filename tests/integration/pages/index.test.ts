import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import IndexPage from "@/pages/index.astro";

describe("Index Page (integration with Layout)", () => {
  let container: AstroContainer;
  let html: string;
  let doc: Document;

  beforeEach(async () => {
    container = await AstroContainer.create();
    html = await container.renderToString(IndexPage, { partial: false });
    doc = new JSDOM(html).window.document;
  });

  // ── HTML document structure ──────────────────────────────────────────────

  it("renders a complete HTML document", async () => {
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("sets the lang attribute to Swedish", async () => {
    const htmlEl = doc.querySelector("html");
    expect(htmlEl?.getAttribute("lang")).toBe("sv");
  });

  it("includes a <head> with charset UTF-8", async () => {
    const meta = doc.querySelector('meta[charset="UTF-8"]');
    expect(meta).not.toBeNull();
  });

  it("includes the viewport meta tag", async () => {
    const meta = doc.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
  });

  it("sets the correct page title", async () => {
    const title = doc.querySelector("title");
    expect(title?.textContent).toBe("Vipsa | Samma städare. Varje gång.");
  });

  it("sets the correct meta description", async () => {
    const meta = doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toContain(
      "Professionell städning i Stockholm",
    );
  });

  // ── Layout: Header ───────────────────────────────────────────────────────

  it("renders the header inside the document", async () => {
    expect(doc.querySelector("header")).not.toBeNull();
  });

  it("renders the home nav link from the Header", async () => {
    const homeLink = doc.querySelector('a[aria-label="Gå till startsidan"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.getAttribute("href")).toBe("/");
  });

  it("renders all main navigation links from the Header", async () => {
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

  // ── Layout: Footer ───────────────────────────────────────────────────────

  it("renders the footer inside the document", async () => {
    expect(doc.querySelector("footer")).not.toBeNull();
  });

  it("renders the Footer brand description", async () => {
    expect(html).toContain(
      "Din lokala partner för ett renare hem och en enklare vardag i Sigtuna.",
    );
  });

  it("renders the Footer contact section with address", async () => {
    expect(html).toContain("Ormbergsvägen 15");
    expect(html).toContain("193 36 Sigtuna");
  });

  it("renders the Footer copyright notice", async () => {
    expect(html).toContain("© 2024 LaganStäd AB. All rights reserved.");
  });

  it("renders the Footer privacy and terms links", async () => {
    expect(doc.querySelector('footer a[href="/privacy"]')).not.toBeNull();
    expect(doc.querySelector('footer a[href="/terms"]')).not.toBeNull();
  });

  // ── Layout: <main> wraps page content ────────────────────────────────────

  it("wraps page sections inside <main>", async () => {
    const main = doc.querySelector("main");
    expect(main).not.toBeNull();
    // HeroSection renders a <header> inside <main>
    expect(main?.querySelector("header")).not.toBeNull();
  });

  // ── Page content: landing sections ───────────────────────────────────────

  it("renders the HeroSection h1", async () => {
    const h1 = doc.querySelector("main h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("Ett renare hem,");
  });

  it("renders the HeroSection primary CTA", async () => {
    expect(html).toContain("Boka städning");
  });

  it("renders the ServiceSection", async () => {
    expect(html).toContain("Våra Tjänster");
  });

  it("renders the HowItWorkSection", async () => {
    expect(html).toContain("Hur det fungerar");
  });

  it("renders the AboutSection", async () => {
    expect(html).toContain("Om Vipsa");
  });

  it("renders the TestimonialsSection", async () => {
    expect(html).toContain("Vad våra kunder säger");
  });
});
