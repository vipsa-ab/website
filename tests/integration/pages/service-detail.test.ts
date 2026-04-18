import { describe, it, expect } from "vitest";
import { renderAstroComponent } from "../helpers";

import Breadcrumb from "@/components/service-detail/Breadcrumb.astro";
import HeroSection from "@/components/service-detail/HeroSection.astro";
import IncludedSection from "@/components/service-detail/IncludedSection.astro";
import ExcludedSection from "@/components/service-detail/ExcludedSection.astro";
import PricingSection from "@/components/service-detail/PricingSection.astro";

const makeArea = (name: string, itemCount: number) => ({
  area: name,
  icon: "material-symbols:home",
  items: Array.from({ length: itemCount }, (_, i) => `${name}-item-${i}`),
});

describe("Breadcrumb", () => {
  it("renders three navigation entries with the expected hrefs", async () => {
    const { doc } = await renderAstroComponent(Breadcrumb, {
      title: "Current",
    });
    const nav = doc.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).not.toBeNull();
    const hrefs = Array.from(nav!.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(["/", "/services"]);
  });

  it("shows the current service title as non-interactive text", async () => {
    const { doc } = await renderAstroComponent(Breadcrumb, {
      title: "MyService",
    });
    const nav = doc.querySelector('nav[aria-label="Breadcrumb"]')!;
    // Exactly one <span> representing the leaf crumb, no link for it
    const spans = nav.querySelectorAll("span");
    expect(spans.length).toBe(1);
    expect(spans[0].textContent).toBe("MyService");
  });
});

describe("HeroSection", () => {
  const baseProps = {
    title: "X",
    icon: "material-symbols:home",
    tagline: "T",
    subtitle: "S",
    ctaLabel: "Book",
  };

  it("exposes exactly one h1 with the service title", async () => {
    const { doc } = await renderAstroComponent(HeroSection, baseProps);
    const h1s = doc.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent?.trim()).toBe(baseProps.title);
  });

  it("exposes booking and pricing entry points", async () => {
    const { doc } = await renderAstroComponent(HeroSection, baseProps);
    expect(doc.querySelector('a[href="/booking"]')).not.toBeNull();
    expect(doc.querySelector('a[href="/pricing"]')).not.toBeNull();
  });

  it("embeds the breadcrumb inside the hero", async () => {
    const { doc } = await renderAstroComponent(HeroSection, baseProps);
    expect(doc.querySelector('nav[aria-label="Breadcrumb"]')).not.toBeNull();
  });

  it("uses the provided ctaLabel as the primary action text", async () => {
    const { doc } = await renderAstroComponent(HeroSection, {
      ...baseProps,
      ctaLabel: "CustomCta",
    });
    const bookingLink = doc.querySelector('a[href="/booking"]')!;
    expect(bookingLink.textContent?.trim()).toBe("CustomCta");
  });
});

describe("IncludedSection", () => {
  it("renders one article per area, with matching item counts", async () => {
    const areas = [makeArea("A", 2), makeArea("B", 4), makeArea("C", 1)];
    const { doc } = await renderAstroComponent(IncludedSection, { areas });

    const articles = doc.querySelectorAll("article");
    expect(articles.length).toBe(areas.length);

    articles.forEach((article, idx) => {
      const items = article.querySelectorAll("ul > li");
      expect(items.length).toBe(areas[idx].items.length);
    });
  });

  it("expands the last article to span 2 columns when areas.length is odd", async () => {
    const areas = [makeArea("A", 1), makeArea("B", 1), makeArea("C", 1)];
    const { doc } = await renderAstroComponent(IncludedSection, { areas });

    const articles = Array.from(doc.querySelectorAll("article"));
    const last = articles[articles.length - 1];
    expect(last.className).toMatch(/md:col-span-2/);

    const others = articles.slice(0, -1);
    others.forEach((article) => {
      expect(article.className).not.toMatch(/md:col-span-2/);
    });
  });

  it("does not apply col-span expansion when areas.length is even", async () => {
    const areas = [
      makeArea("A", 1),
      makeArea("B", 1),
      makeArea("C", 1),
      makeArea("D", 1),
    ];
    const { doc } = await renderAstroComponent(IncludedSection, { areas });

    const articles = doc.querySelectorAll("article");
    articles.forEach((article) => {
      expect(article.className).not.toMatch(/md:col-span-2/);
    });
  });
});

describe("ExcludedSection", () => {
  it("renders one list item per excluded entry", async () => {
    const items = ["alpha", "beta", "gamma", "delta"];
    const { doc } = await renderAstroComponent(ExcludedSection, { items });

    const lis = doc.querySelectorAll("ul > li");
    expect(lis.length).toBe(items.length);
  });
});

describe("PricingSection — badges", () => {
  const baseProps = {
    price: "100 kr",
    unit: "/tim",
    rutIncluded: true,
    minHours: null as number | null,
    description: "desc",
    highlights: ["h1", "h2"],
    ctaLabel: "Book",
  };

  const badgeSelector = 'section#pricing span[class*="rounded-full"]';

  it("shows a RUT badge and no company badge when rutIncluded is true", async () => {
    const { doc } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      rutIncluded: true,
    });
    expect(doc.querySelector('[class*="bg-primary/10"]')).not.toBeNull();
    expect(doc.querySelector('[class*="bg-secondary/10"]')).toBeNull();
  });

  it("shows a company badge and no RUT badge when rutIncluded is false", async () => {
    const { doc } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      rutIncluded: false,
    });
    expect(doc.querySelector('[class*="bg-secondary/10"]')).not.toBeNull();
    expect(doc.querySelector('[class*="bg-primary/10"]')).toBeNull();
  });

  it("renders the minHours badge only when minHours is a number", async () => {
    const { doc: withHours } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      minHours: 3,
    });
    const { doc: withoutHours } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      minHours: null,
    });

    expect(withHours.querySelectorAll(badgeSelector).length).toBe(2);
    expect(withoutHours.querySelectorAll(badgeSelector).length).toBe(1);
  });

  it("renders one highlight list item per highlights entry", async () => {
    const highlights = ["a", "b", "c"];
    const { doc } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      highlights,
    });
    const lis = doc.querySelectorAll("section#pricing ul > li");
    expect(lis.length).toBe(highlights.length);
  });

  it("exposes the price and unit strings verbatim from props", async () => {
    const { doc } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      price: "999 kr",
      unit: "/session",
    });
    const html = doc.body.innerHTML;
    expect(html).toContain("999 kr");
    expect(html).toContain("/session");
  });

  it("provides a booking entry point with the provided ctaLabel", async () => {
    const { doc } = await renderAstroComponent(PricingSection, {
      ...baseProps,
      ctaLabel: "CtaXYZ",
    });
    const link = doc.querySelector(
      'section#pricing a[href="/booking"]',
    ) as HTMLAnchorElement | null;
    expect(link).not.toBeNull();
    expect(link!.textContent?.trim()).toBe("CtaXYZ");
  });
});
