import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import ServiceCard from "@/components/services/ServiceCard.astro";

const defaultProps = {
  title: "Hemstädning",
  description: "Regelbunden hemstädning anpassas efter ditt schema.",
  icon: "material-symbols:house-rounded",
  color: "primary" as const,
  features: ["Valfri frekvens", "Samma städare varje gång"],
};

describe("Services ServiceCard", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
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

  it("renders the description", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain(
      "Regelbunden hemstädning anpassas efter ditt schema.",
    );
  });

  it("renders the icon with correct name", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain('data-icon="material-symbols:house-rounded"');
  });

  it("renders all features with check icons", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    const doc = new JSDOM(html).window.document;
    const items = doc.querySelectorAll("li");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("Valfri frekvens");
    expect(items[1].textContent).toContain("Samma städare varje gång");
  });

  it("applies primary color classes", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    expect(html).toContain("bg-primary-fixed");
    expect(html).toContain("text-primary");
  });

  it("applies secondary color classes", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: { ...defaultProps, color: "secondary" as const },
    });
    expect(html).toContain("bg-secondary-fixed");
    expect(html).toContain("text-secondary");
  });

  it("applies tertiary color classes", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: { ...defaultProps, color: "tertiary" as const },
    });
    expect(html).toContain("bg-tertiary-fixed");
    expect(html).toContain("text-tertiary");
  });

  it("renders check-circle icons for each feature", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: defaultProps,
    });
    const matches = html.match(/data-icon="material-symbols:check-circle"/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(defaultProps.features.length);
  });

  it("reflects different props", async () => {
    const html = await container.renderToString(ServiceCard, {
      props: {
        title: "Kontorsstädning",
        description: "Ett rent kontor.",
        icon: "material-symbols:corporate-fare",
        color: "tertiary" as const,
        features: ["Anpassat efter kontorstider"],
      },
    });
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelector("h3")!.textContent?.trim()).toBe(
      "Kontorsstädning",
    );
    expect(html).toContain("Ett rent kontor.");
    expect(html).toContain('data-icon="material-symbols:corporate-fare"');
    expect(doc.querySelectorAll("li").length).toBe(1);
  });
});
