// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

import react from "@astrojs/react";

import node from "@astrojs/node";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.vipsa.se",
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: "jsx", jsx: "react" })],
  },
  security: {
    checkOrigin: true,

    allowedDomains: [
      {
        hostname: "www.vipsa.se",
        protocol: "https",
        port: "443",
      },
    ],
  },

  integrations: [react(), icon(), sitemap()],

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
