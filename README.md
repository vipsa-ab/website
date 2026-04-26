# Vipsa — Frontend

Vipsa's marketing website — premium cleaning service in Stockholm. Built with Astro, React, and Tailwind CSS v4.

**Live:** [vipsa.se](https://www.vipsa.se)

## Stack

| Technology | Purpose |
|------------|---------|
| **Astro** 6.x | SSR via Node adapter, file-based routing, SPA transitions with `<ClientRouter>` |
| **React** 19 | Interactive islands (forms, maps, pricing calculator) |
| **TypeScript** strict | Static typing throughout |
| **Tailwind CSS** v4 | Material Design 3 tokens + custom utilities (`glass-nav`, `signature-gradient`, `text-glow`) |
| **Zod** + `react-hook-form` | Form validation |
| **Vitest** + **Playwright** | Unit, integration, and E2E testing |

## Pages

```
src/pages/
├── index.astro              # Landing page
├── 404.astro                # Error page
├── about.astro             # About us
├── booking.astro            # Book a service
├── contact.astro           # Contact page
├── pricing.astro            # Pricing calculator + RUT
├── privacy.astro           # Privacy policy
├── terms.astro             # Terms & conditions
├── services/
│   ├── index.astro          # Service catalog
│   └── [slug].astro          # Service detail (dynamic route)
└── robots.txt.ts            # robots.txt generator
```

## Architecture

```
src/
├── assets/img/              # Static images
├── components/
│   ├── about/               # HeroSection, StorySection, ValuesSection, TeamSection, TeamCard, CtaSection
│   ├── booking/             # HeroSection, BookingForm (React island)
│   ├── contact/             # HeroSection, InfoSection, ContactForm, ContactMap, TrustBarSection
│   ├── landing/             # HeroSection, ServiceSection, HowItWorkSection, AboutSection,
│   │                        # OthersServicesSection, TestimonialsSection, TestimonialCard
│   ├── pricing/             # HeroSection, PricingSection, CalculatorSection, RutSection, FaqSection
│   ├── service-detail/      # HeroSection, Breadcrumb, IntroSection, IncludedSection,
│   │                        # ExcludedSection, PricingSection, FaqSection
│   ├── services/            # ServicesSection, ServiceCard, OtherServicesSection, CtaSection
│   └── ui/                  # Header, Footer, MobileMenu, FaqCard
├── content/
│   └── services/            # Markdown content for services (home-cleaning, office-cleaning, etc.)
├── content.config.ts        # Astro Content Collections config
├── icons/                   # Logo SVG
├── layouts/
│   └── Layout.astro         # Root shell — persistent Header/Footer with transition:persist
├── lib/
│   └── utils.ts             # Helpers (cn(), etc.)
├── pages/                   # File-based routes (see above)
├── styles/
│   └── global.css           # @theme tokens + @utility custom directives
└── types/                   # TypeScript interfaces
```

## Commands

```bash
# Development
pnpm dev              # Dev server at localhost:4321

# Build
pnpm build            # Production build to ./dist/
pnpm preview          # Preview production build locally

# Code quality
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier format

# Testing
pnpm test              # Unit + Integration (Vitest)
pnpm test:watch        # Vitest watch mode
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests only
pnpm test:coverage     # Coverage report
pnpm test:e2e          # E2E with Playwright
pnpm test:e2e:ui       # Playwright UI
```

## Design System — "The Digital Sanctuary"

See `DESIGN.md` for the full specification (Nordic Lagom aesthetic).

### Key Rules

- **NO 1px borders** — section separation via tonal surface shifts (`surface` → `surface-container-*`)
- **Glassmorphism**: 80% opacity + `backdrop-blur-[20px]` on navbars and floating elements
- **Signature gradient**: `primary` (#2c5f5d) → `primary-container` (#ff7e33) at 135° for primary CTAs
- **Shadows**: Max 4% opacity — should feel like atmospheric light, not dark smudges
- **Typography**: Manrope for headlines (tracking -0.02em), Plus Jakarta Sans for body, `label-md` all-caps with tracking +0.1em for tags

### Main Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#2c5f5d` | Main color (teal) |
| `primary-container` | `#ff7e33` | Signature accent (orange) |
| `on-surface` | `#1a1c1c` | Text (never #000000) |
| `surface` | `#f9f9f9` | Base background |
| `surface-container-*` | varies | Elevation and cards |

## Testing

```
tests/
├── unit/          # Vitest + jsdom (React components, utils, schemas)
├── integration/   # Vitest + jsdom (full pages, routing)
└── e2e/           # Playwright (Chromium, Firefox, Safari, Mobile)
```

## Path Alias

`@/` maps to `./src/` (configured in both `tsconfig.json` and `vitest.config.ts`).

## Setup

```bash
pnpm install
pnpm dev
```

Node.js >= 22.12.0 required.

## Further reading

- [DESIGN.md](./DESIGN.md) — Full design system specification
- [AGENTS.md](./AGENTS.md) — Guidance for Claude Code (AI agents)
- [CLAUDE.md](./CLAUDE.md) — Additional project configuration