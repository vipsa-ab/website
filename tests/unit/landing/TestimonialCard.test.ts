import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import type { ImageMetadata } from "astro";
import TestimonialCard from "@/components/landing/TestimonialCard.astro";

const mockImage: ImageMetadata = {
  src: "/test-avatar.webp",
  width: 100,
  height: 100,
  format: "webp",
};

const baseProps = {
  quote: "Great service! Highly recommended.",
  rating: 5,
  name: "Anna Svensson",
  title: "Villaägare",
  imageSrc: mockImage,
  imageAlt: "Headshot of Anna",
};

describe("TestimonialCard", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the quote text", async () => {
    const html = await container.renderToString(TestimonialCard, {
      props: baseProps,
    });
    expect(html).toContain("Great service! Highly recommended.");
  });

  it("renders the author name", async () => {
    const html = await container.renderToString(TestimonialCard, {
      props: baseProps,
    });
    expect(html).toContain("Anna Svensson");
  });

  it("renders the author title", async () => {
    const html = await container.renderToString(TestimonialCard, {
      props: baseProps,
    });
    expect(html).toContain("Villaägare");
  });

  it("renders image with name as alt text", async () => {
    const html = await container.renderToString(TestimonialCard, {
      props: baseProps,
    });
    expect(html).toContain('alt="Anna Svensson"');
  });

  it("renders image with data-alt attribute", async () => {
    const html = await container.renderToString(TestimonialCard, {
      props: baseProps,
    });
    expect(html).toContain('data-alt="Headshot of Anna"');
  });

  it("renders the decorative quote mark", async () => {
    const html = await container.renderToString(TestimonialCard, {
      props: baseProps,
    });
    expect(html).toContain('"');
  });

  describe("star rating rendering", () => {
    function countStars(html: string, iconName: string): number {
      const pattern = `data-icon="${iconName}"`;
      return (html.match(new RegExp(pattern, "g")) || []).length;
    }

    it("rating=5: renders 5 filled stars and 0 empty stars", async () => {
      const html = await container.renderToString(TestimonialCard, {
        props: { ...baseProps, rating: 5 },
      });
      expect(countStars(html, "material-symbols:star")).toBe(5);
      expect(countStars(html, "material-symbols:star-outline")).toBe(0);
    });

    it("rating=3: renders 3 filled stars and 2 empty stars", async () => {
      const html = await container.renderToString(TestimonialCard, {
        props: { ...baseProps, rating: 3 },
      });
      expect(countStars(html, "material-symbols:star")).toBe(3);
      expect(countStars(html, "material-symbols:star-outline")).toBe(2);
    });

    it("rating=1: renders 1 filled star and 4 empty stars", async () => {
      const html = await container.renderToString(TestimonialCard, {
        props: { ...baseProps, rating: 1 },
      });
      expect(countStars(html, "material-symbols:star")).toBe(1);
      expect(countStars(html, "material-symbols:star-outline")).toBe(4);
    });

    it("rating=0: renders 0 filled stars and 5 empty stars", async () => {
      const html = await container.renderToString(TestimonialCard, {
        props: { ...baseProps, rating: 0 },
      });
      expect(countStars(html, "material-symbols:star")).toBe(0);
      expect(countStars(html, "material-symbols:star-outline")).toBe(5);
    });
  });
});
