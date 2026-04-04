# Vipsa — Frontend

Sitio web de Vipsa construido con Astro, React y Tailwind CSS v4.

## Stack

- **Astro** (SSR via Node adapter) — routing file-based, SPA transitions con `<ClientRouter>`
- **React** — islands interactivos
- **TypeScript** (strict)
- **Tailwind CSS v4** — tokens de color Material Design 3
- **Vitest** + **Playwright** — tests unitarios, de integración y E2E

## Estructura del proyecto

```text
/
├── public/
├── src/
│   ├── assets/img/
│   ├── components/
│   │   ├── ui/          # Header, Footer
│   │   ├── landing/     # HeroSection, ServiceSection, etc.
│   │   └── icones/      # Logo SVG
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css   # Tokens @theme + utilidades custom
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── package.json
```

## Comandos

| Comando                 | Acción                                        |
| :---------------------- | :-------------------------------------------- |
| `pnpm install`          | Instala dependencias                          |
| `pnpm dev`              | Servidor de desarrollo en `localhost:4321`    |
| `pnpm build`            | Build de producción en `./dist/`              |
| `pnpm preview`          | Previsualiza el build localmente              |
| `pnpm lint`             | Chequeo ESLint                                |
| `pnpm lint:fix`         | Corrige errores de lint automáticamente       |
| `pnpm format`           | Formatea con Prettier                         |
| `pnpm test`             | Todos los tests (unitarios + integración)     |
| `pnpm test:unit`        | Solo tests unitarios                          |
| `pnpm test:integration` | Solo tests de integración                     |
| `pnpm test:coverage`    | Reporte de cobertura                          |
| `pnpm test:e2e`         | Tests E2E con Playwright                      |

## Design System

El diseño sigue la estética **"The Digital Sanctuary" / Nordic Lagom**. Ver `DESIGN.md` para la especificación completa.

Puntos clave:
- **Sin bordes de 1px** — separación de secciones mediante cambios tonales de superficie
- **Colores**: naranja `#ff7e33` (primary-container), teal `#2c5f5d` (primary), negro suave `#1a1c1c` (on-surface)
- **Glassmorphism**: opacidad 80% + `backdrop-blur-[20px]` en navbar y elementos flotantes
- **Gradiente signature**: `primary` → `primary-container` a 135° para CTAs primarios (utilidad `signature-gradient`)
- **Tipografía**: Manrope para titulares, Plus Jakarta Sans para cuerpo
