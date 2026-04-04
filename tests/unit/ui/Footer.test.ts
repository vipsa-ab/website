import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import Footer from "@/components/ui/Footer.astro";

describe("Footer", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders a <footer> element", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("<footer");
  });

  it("renders the brand description", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain(
      "Din lokala partner för ett renare hem och en enklare vardag i Sigtuna.",
    );
  });

  it("renders quick links section heading", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("Snabblänkar");
  });

  it("renders quick links for all main pages", async () => {
    const html = await container.renderToString(Footer);
    const doc = new JSDOM(html).window.document;
    const links = Array.from(doc.querySelectorAll("footer a")).map((a) => ({
      href: a.getAttribute("href"),
      text: a.textContent?.trim(),
    }));

    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/", text: "Hem" }),
        expect.objectContaining({ href: "/services", text: "Tjänster" }),
        expect.objectContaining({ href: "/about", text: "Om Oss" }),
        expect.objectContaining({ href: "/booking", text: "Boka Nu" }),
      ]),
    );
  });

  it("renders contact section heading", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("Kontaktuppgifter");
  });

  it("renders the physical address", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("Ormbergsvägen 15");
    expect(html).toContain("193 36 Sigtuna");
  });

  it("renders the phone number", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("08-123 45 67");
  });

  it("renders the email address", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("info@vipsa.se");
  });

  it("renders the opening hours", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("Mån-Fre: 08:00 - 17:00");
  });

  it("renders Facebook social link", async () => {
    const html = await container.renderToString(Footer);
    const doc = new JSDOM(html).window.document;
    const fbLink = doc.querySelector(
      'a[href="https://www.facebook.com/vipsa"]',
    );
    expect(fbLink).not.toBeNull();
    expect(fbLink?.getAttribute("target")).toBe("_blank");
    expect(fbLink?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders Instagram social link", async () => {
    const html = await container.renderToString(Footer);
    const doc = new JSDOM(html).window.document;
    const igLink = doc.querySelector(
      'a[href="https://www.instagram.com/vipsa"]',
    );
    expect(igLink).not.toBeNull();
    expect(igLink?.getAttribute("target")).toBe("_blank");
    expect(igLink?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders the copyright notice", async () => {
    const html = await container.renderToString(Footer);
    expect(html).toContain("© 2024 LaganStäd AB. All rights reserved.");
  });

  it("renders the privacy policy link", async () => {
    const html = await container.renderToString(Footer);
    const doc = new JSDOM(html).window.document;
    const privacyLink = doc.querySelector('a[href="/privacy"]');
    expect(privacyLink).not.toBeNull();
    expect(privacyLink?.textContent?.trim()).toBe("Integritetspolicy");
  });

  it("renders the terms of service link", async () => {
    const html = await container.renderToString(Footer);
    const doc = new JSDOM(html).window.document;
    const termsLink = doc.querySelector('a[href="/terms"]');
    expect(termsLink).not.toBeNull();
    expect(termsLink?.textContent?.trim()).toBe("Användarvillkor");
  });
});
