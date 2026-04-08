import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import TeamCard from "@/components/about/TeamCard.astro";

const defaultProps = {
  name: "Test Person",
  role: "Test Role",
  description: "Test description text",
  image: {
    src: "/test-image.webp",
    width: 400,
    height: 400,
    format: "webp" as const,
  },
};

describe("About TeamCard", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders the member name", async () => {
    const html = await container.renderToString(TeamCard, {
      props: defaultProps,
    });
    const doc = new JSDOM(html).window.document;
    const h4 = doc.querySelector("h4");
    expect(h4).not.toBeNull();
    expect(h4!.textContent).toBe("Test Person");
  });

  it("renders the member role with primary color", async () => {
    const html = await container.renderToString(TeamCard, {
      props: defaultProps,
    });
    const doc = new JSDOM(html).window.document;
    const roleEl = doc.querySelector(".text-primary");
    expect(roleEl).not.toBeNull();
    expect(roleEl!.textContent?.trim()).toBe("Test Role");
  });

  it("renders the member description", async () => {
    const html = await container.renderToString(TeamCard, {
      props: defaultProps,
    });
    expect(html).toContain("Test description text");
  });

  it("renders the member image", async () => {
    const html = await container.renderToString(TeamCard, {
      props: defaultProps,
    });
    const doc = new JSDOM(html).window.document;
    const img = doc.querySelector("img");
    expect(img).not.toBeNull();
  });

  it("applies grayscale filter to image by default", async () => {
    const html = await container.renderToString(TeamCard, {
      props: defaultProps,
    });
    expect(html).toContain("grayscale");
  });

  it("applies hover translate animation class", async () => {
    const html = await container.renderToString(TeamCard, {
      props: defaultProps,
    });
    expect(html).toContain("hover:-translate-y-2");
  });
});
