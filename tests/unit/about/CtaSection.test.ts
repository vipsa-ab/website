import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import CtaSection from "@/components/about/CtaSection.astro";

describe("About CtaSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain("<section");
  });

  it("renders the heading", async () => {
    const html = await container.renderToString(CtaSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toContain("Vill du bli en del av vårt team?");
  });

  it("renders the description text", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain("Vi letar alltid efter passionerade människor");
  });

  it("renders the jobs link with correct href", async () => {
    const html = await container.renderToString(CtaSection);
    const doc = new JSDOM(html).window.document;
    const jobsLink = doc.querySelector('a[href="/services"]');
    expect(jobsLink).not.toBeNull();
    expect(jobsLink!.textContent?.trim()).toBe("Lediga tjänster");
  });

  it("renders the booking link with correct href", async () => {
    const html = await container.renderToString(CtaSection);
    const doc = new JSDOM(html).window.document;
    const bookingLink = doc.querySelector('a[href="/booking"]');
    expect(bookingLink).not.toBeNull();
    expect(bookingLink!.textContent?.trim()).toBe("Boka städning");
  });

  it("applies signature gradient to the card", async () => {
    const html = await container.renderToString(CtaSection);
    expect(html).toContain("signature-gradient");
  });
});
