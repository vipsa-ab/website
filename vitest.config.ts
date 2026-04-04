import { getViteConfig } from "astro/config";
import { resolve } from "path";

const alias = { "@": resolve(__dirname, "./src") };

export default getViteConfig({
  resolve: { alias },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx,astro}"],
      exclude: ["src/components/ui/**", "src/env.d.ts"],
    },
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],
  },
} as any);
