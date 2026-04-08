import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import TeamSection from "@/components/about/TeamSection.astro";

describe("About TeamSection", () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("wraps content in a section element", async () => {
    const html = await container.renderToString(TeamSection);
    expect(html).toContain("<section");
  });

  it("renders the section heading", async () => {
    const html = await container.renderToString(TeamSection);
    const doc = new JSDOM(html).window.document;
    const h2 = doc.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toBe("Möt Vårt Team");
  });

  it("renders the section subtitle", async () => {
    const html = await container.renderToString(TeamSection);
    expect(html).toContain("Människorna bakom glansen i ditt hem");
  });

  it("renders all four team members", async () => {
    const html = await container.renderToString(TeamSection);
    const doc = new JSDOM(html).window.document;
    const h4s = doc.querySelectorAll("h4");
    expect(h4s).toHaveLength(4);
  });

  it("renders each team member name", async () => {
    const html = await container.renderToString(TeamSection);
    expect(html).toContain("Elin Karlsson");
    expect(html).toContain("Johan Lindberg");
    expect(html).toContain("Sara Andersson");
    expect(html).toContain("Markus Berg");
  });

  it("renders each team member role", async () => {
    const html = await container.renderToString(TeamSection);
    expect(html).toContain("Teamledare &amp; Kvalitetsansvarig");
    expect(html).toContain("Fönsterspecialist");
    expect(html).toContain("Hållbarhetskoordinator");
    expect(html).toContain("Driftchef");
  });

  it("renders each team member description", async () => {
    const html = await container.renderToString(TeamSection);
    expect(html).toContain("Expert på varsam rengöring");
    expect(html).toContain("Ger dina fönster en lyster");
    expect(html).toContain("Ser till att våra metoder");
    expect(html).toContain("Logistikens mästare");
  });

  it("uses a 4-column grid layout on large screens", async () => {
    const html = await container.renderToString(TeamSection);
    expect(html).toContain("lg:grid-cols-4");
  });
});
