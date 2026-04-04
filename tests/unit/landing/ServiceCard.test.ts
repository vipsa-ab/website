import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import type { ImageMetadata } from "astro";
import ServiceCard from "@/components/landing/ServiceCard.astro";

const mockImage: ImageMetadata = {
  src: "/test.webp",
  width: 400,
  height: 300,
  format: "webp",
};

const defaultProps = {
  title: "Hemstädning",
  description: "Regelbunden städning som anpassas efter dina behov.",
  imageUrl: mockImage,
  dataAlt: "A cleaner working",
  linkUrl: "/services/home-cleaning",
};

describe("ServiceCard", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders image with title as alt text", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain('alt="Hemstädning"');
  });

  it("renders image with data-alt attribute", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain('data-alt="A cleaner working"');
  });

  it("renders the title in an h3", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    const doc = new JSDOM(html).window.document;
    const h3 = doc.querySelector("h3");
    expect(h3).not.toBeNull();
    expect(h3!.textContent?.trim()).toBe("Hemstädning");
  });

  it("renders the description paragraph", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain(
      "Regelbunden städning som anpassas efter dina behov.",
    );
  });

  it("renders the link with correct href", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain('href="/services/home-cleaning"');
  });

  it("renders sr-only span with title", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    const doc = new JSDOM(html).window.document;
    const srOnly = doc.querySelector(".sr-only");
    expect(srOnly).not.toBeNull();
    expect(srOnly!.textContent?.trim()).toBe("om Hemstädning");
  });

  it("renders the arrow-forward icon", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain('data-icon="material-symbols:arrow-forward"');
  });

  it("reflects a different title prop", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: {
        ...defaultProps,
        title: "Kontorsstädning",
        linkUrl: "/services/office-cleaning",
      },
    });
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelector("h3")!.textContent?.trim()).toBe(
      "Kontorsstädning",
    );
    expect(doc.querySelector(".sr-only")!.textContent?.trim()).toBe(
      "om Kontorsstädning",
    );
    expect(html).toContain('href="/services/office-cleaning"');
  });
});
