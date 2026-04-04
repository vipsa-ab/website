# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:4321)
pnpm build        # Build for production (output: ./dist/)
pnpm preview      # Preview production build
pnpm lint         # ESLint check
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Prettier format

pnpm test              # All unit + integration tests
pnpm test:watch        # Watch mode
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests only
pnpm test:coverage     # Coverage report
pnpm test:e2e          # Playwright E2E (requires running dev server or starts one)
```

## Architecture

**Stack**: Astro (SSR via Node adapter) + React (for interactive islands) + TypeScript (strict) + Tailwind CSS v4

**Routing**: File-based via `src/pages/`. Currently `index.astro` (landing page) and `404.astro`.

**Layouts**: `src/layouts/Layout.astro` is the root shell — it includes the persistent Header/Footer (using `transition:persist`), Astro's `<ClientRouter>` for SPA-like transitions, and font loading (Manrope + Plus Jakarta Sans from Fontsource).

**Component organization**:
- `src/components/ui/` — site-wide layout components (Header, Footer)
- `src/components/landing/` — page-section components (HeroSection, ServiceSection, etc.), exported via barrel `index.ts`
- `src/components/icones/` — SVG icon components (Logo)

**Styling**: Tailwind CSS v4 with Material Design 3 color tokens defined as `@theme` variables in `src/styles/global.css`. Custom `@utility` directives: `glass-nav`, `signature-gradient`, `text-glow`. Icons via `astro-icon` with Iconify (Material Symbols, Tabler sets).

**Path alias**: `@/` maps to `./src/` (configured in both `tsconfig.json` and `vitest.config.ts`).

**Testing layout**:
- `tests/unit/` — Vitest + jsdom
- `tests/integration/` — Vitest + jsdom
- `tests/e2e/` — Playwright (Chromium, Firefox, Safari, Mobile Chrome, Mobile Safari)
- `tests/setup.ts` — Testing Library config

## Design System

See `DESIGN.md` for the full design specification ("The Digital Sanctuary" / Nordic Lagom aesthetic). Key rules:
- **No 1px borders** — use tonal surface shifts (`surface` → `surface-container-*`) for section separation
- **Colors**: Signature orange `#ff7e33` (primary-container), teal `#2c5f5d` (primary), near-black `#1a1c1c` (on-surface — never pure `#000000`)
- **Glassmorphism**: 80% opacity + `backdrop-blur-[20px]` for navbars and floating elements
- **Signature gradient**: `primary` → `primary-container` at 135° for primary CTAs (`signature-gradient` utility)
- **Shadows**: Max 4% opacity — should feel like atmospheric light, not dark smudges
- **Typography**: Manrope for headlines (tight tracking `-0.02em`), Plus Jakarta Sans for body; `label-md` in all-caps with `+0.1em` tracking for category tags
