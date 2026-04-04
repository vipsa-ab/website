import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";

export default [
  ...eslintPluginAstro.configs["flat/recommended"],
  eslintConfigPrettier,
  // TS/TSX files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser },
    plugins: { prettier: eslintPluginPrettier },
    rules: { "prettier/prettier": "error" },
  },
  // JS files
  {
    files: ["**/*.{js,jsx}"],
    plugins: { prettier: eslintPluginPrettier },
    rules: { "prettier/prettier": "error" },
  },
  // Astro <script> blocks — the Astro processor exposes these as virtual *.astro/N_N.ts
  // files. Frontmatter (between ---) is not accessible as a virtual file; use `pnpm format`
  // (prettier-plugin-astro) to format it.
  {
    files: ["**/*.astro/**"],
    languageOptions: { parser: tsParser },
    plugins: { prettier: eslintPluginPrettier },
    rules: { "prettier/prettier": ["error", { parser: "typescript" }] },
  },
];
