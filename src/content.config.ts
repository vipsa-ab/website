import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(["main", "additional"]),
  order: z.number(),
  hero: z.object({
    tagline: z.string(),
    subtitle: z.string(),
  }),
  included: z
    .array(
      z.object({
        area: z.string(),
        icon: z.string(),
        items: z.array(z.string()).min(1),
      }),
    )
    .min(1),
  excluded: z.array(z.string()).min(1),
  pricing: z.object({
    price: z.string(),
    unit: z.string(),
    rutIncluded: z.boolean().default(true),
    minHours: z.number().nullable().default(null),
    description: z.string(),
    highlights: z.array(z.string()).min(1),
  }),
  ctaLabel: z.string().default("Boka städning"),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: serviceSchema,
});

export const collections = { services };
