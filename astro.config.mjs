// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), icon()],

  output: "server",
  adapter: node({
    mode: "standalone",
  }),

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Manrope",
      weights: ["200 800"],
      subsets: ["latin"],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
      formats: ["woff2"],
      cssVariable: "--font-manrope",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Plus Jakarta Sans",
      weights: ["200 800"],
      subsets: ["latin"],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
      formats: ["woff2"],
      cssVariable: "--font-plus-jakarta-sans",
    },
  ],
});
