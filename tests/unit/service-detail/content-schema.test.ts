import { describe, it, expect } from "vitest";
import { serviceSchema } from "@/content.config";

const validFixture = {
  title: "Test Service",
  description: "A description",
  icon: "material-symbols:home",
  category: "main" as const,
  order: 1,
  hero: { tagline: "Tagline", subtitle: "Subtitle" },
  included: [
    { area: "Kök", icon: "material-symbols:kitchen", items: ["Item 1"] },
  ],
  excluded: ["Not included"],
  pricing: {
    price: "195 kr",
    unit: "/tim",
    rutIncluded: true,
    minHours: 3,
    description: "Pricing description",
    highlights: ["Highlight 1"],
  },
  ctaLabel: "Custom label",
};

describe("serviceSchema — required shape", () => {
  it("accepts a fully-valid service", () => {
    const result = serviceSchema.safeParse(validFixture);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid category", () => {
    const result = serviceSchema.safeParse({
      ...validFixture,
      category: "other",
    });
    expect(result.success).toBe(false);
  });

  it("requires included to have at least one area", () => {
    const result = serviceSchema.safeParse({ ...validFixture, included: [] });
    expect(result.success).toBe(false);
  });

  it("requires each included area to have at least one item", () => {
    const result = serviceSchema.safeParse({
      ...validFixture,
      included: [{ area: "X", icon: "i", items: [] }],
    });
    expect(result.success).toBe(false);
  });

  it("requires excluded to have at least one item", () => {
    const result = serviceSchema.safeParse({ ...validFixture, excluded: [] });
    expect(result.success).toBe(false);
  });

  it("requires pricing.highlights to have at least one item", () => {
    const result = serviceSchema.safeParse({
      ...validFixture,
      pricing: { ...validFixture.pricing, highlights: [] },
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric order", () => {
    const result = serviceSchema.safeParse({
      ...validFixture,
      order: "first",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing hero subtree", () => {
    const { hero: _hero, ...withoutHero } = validFixture;
    const result = serviceSchema.safeParse(withoutHero);
    expect(result.success).toBe(false);
  });
});

describe("serviceSchema — defaults and optional behavior", () => {
  it("applies the default ctaLabel when omitted", () => {
    const { ctaLabel: _label, ...withoutCta } = validFixture;
    const result = serviceSchema.parse(withoutCta);
    expect(typeof result.ctaLabel).toBe("string");
    expect(result.ctaLabel.length).toBeGreaterThan(0);
  });

  it("defaults pricing.rutIncluded to true when omitted", () => {
    const { rutIncluded: _r, ...pricingWithoutRut } = validFixture.pricing;
    const result = serviceSchema.parse({
      ...validFixture,
      pricing: pricingWithoutRut,
    });
    expect(result.pricing.rutIncluded).toBe(true);
  });

  it("defaults pricing.minHours to null when omitted", () => {
    const { minHours: _m, ...pricingWithoutMinHours } = validFixture.pricing;
    const result = serviceSchema.parse({
      ...validFixture,
      pricing: pricingWithoutMinHours,
    });
    expect(result.pricing.minHours).toBeNull();
  });

  it("accepts pricing.minHours = null explicitly", () => {
    const result = serviceSchema.safeParse({
      ...validFixture,
      pricing: { ...validFixture.pricing, minHours: null },
    });
    expect(result.success).toBe(true);
  });

  it("accepts both main and additional category values", () => {
    const mainResult = serviceSchema.safeParse({
      ...validFixture,
      category: "main",
    });
    const additionalResult = serviceSchema.safeParse({
      ...validFixture,
      category: "additional",
    });
    expect(mainResult.success).toBe(true);
    expect(additionalResult.success).toBe(true);
  });
});
