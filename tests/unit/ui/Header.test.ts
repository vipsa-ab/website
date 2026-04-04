import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import Header from "@/components/ui/Header.astro";

describe("Header", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders a <header> element", async () => {
    const html = await container.renderToString(Header);
    expect(html).toContain("<header");
  });

  it("renders a <nav> element", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelector("nav")).not.toBeNull();
  });

  it("nav is fixed and has z-50", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    const nav = doc.querySelector("nav");
    expect(nav?.className).toContain("fixed");
    expect(nav?.className).toContain("z-50");
  });

  it("logo link points to home", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    const logoLink = doc.querySelector('a[aria-label="Gå till startsidan"]');
    expect(logoLink).not.toBeNull();
    expect(logoLink?.getAttribute("href")).toBe("/");
  });

  it("renders nav links for all main pages", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    const links = Array.from(doc.querySelectorAll("nav a")).map((a) => ({
      href: a.getAttribute("href"),
      text: a.textContent?.trim(),
    }));

    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/", text: "Hem" }),
        expect.objectContaining({ href: "/services", text: "Tjänster" }),
        expect.objectContaining({ href: "/about", text: "Om Oss" }),
        expect.objectContaining({ href: "/pricing", text: "Prislista" }),
        expect.objectContaining({ href: "/contact", text: "Kontakt" }),
      ]),
    );
  });

  it("renders the booking CTA button linking to /booking", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    const bookingLink = doc.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
    expect(bookingLink?.textContent?.trim()).toBe("Boka Nu");
  });

  it("booking CTA has signature-gradient class", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    const bookingLink = doc.querySelector('a[href="/booking"]');
    expect(bookingLink?.className).toContain("signature-gradient");
  });

  it("nav links are hidden on mobile and visible on md+", async () => {
    const html = await container.renderToString(Header);
    const doc = new JSDOM(html).window.document;
    const navGroup = doc.querySelector(".md\\:flex");
    expect(navGroup).not.toBeNull();
    expect(navGroup?.className).toContain("hidden");
  });
});
