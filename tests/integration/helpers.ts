import { experimental_AstroContainer as AstroContainer } from "astro/container";
import reactSSR from "@astrojs/react/server.js";
import { JSDOM } from "jsdom";
import { getQueriesForElement } from "@testing-library/dom";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export interface PageRenderResult {
  /** Testing Library queries bound to the document body */
  screen: ReturnType<typeof getQueriesForElement>;
  /** Raw JSDOM document for landmark/meta assertions */
  doc: Document;
}

/**
 * Renders a full Astro page (with Layout) and returns Testing Library queries.
 */
export async function renderPage(
  Page: AstroComponentFactory,
): Promise<PageRenderResult> {
  const container = await AstroContainer.create();
  container.addServerRenderer({ renderer: reactSSR });
  const html = await container.renderToString(Page, { partial: false });
  const doc = new JSDOM(html).window.document;
  const screen = getQueriesForElement(doc.body);
  return { screen, doc };
}
