# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start development server
npm run build     # Generate Prisma client + build (prisma generate && next build)
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

Single-purpose event registration app for "Mesas Redondas BPA" events. Stack: Next.js (App Router), React 19, Tailwind CSS v4, Prisma 7 with PostgreSQL.

**Path alias**: `@/*` → `src/*`

### Key files

- [src/app/page.js](src/app/page.js) — Entire UI: a 3-step client-side wizard (date selection → form → success). Animations driven by **GSAP** (step transitions) and **Anime.js** (continuous floating assets).
- [src/app/api/register/route.js](src/app/api/register/route.js) — Single POST endpoint. Upserts on `correo` (email) as the unique key.
- [src/lib/prisma.ts](src/lib/prisma.ts) — Prisma singleton using the `pg` + `PrismaPg` adapter (required for Prisma Data Platform pooled connections).
- [prisma/schema.prisma](prisma/schema.prisma) — Single `Registration` model. Client generated to `src/generated/prisma`.

### Database

- **Dev**: SQLite (`dev.db` at project root)
- **Prod**: PostgreSQL on Prisma Data Platform (pooled via `DATABASE_URL` in `.env`)
- After schema changes: `npx prisma migrate dev` (dev) or `npx prisma migrate deploy` (prod), then `npm run build` regenerates the client.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. No `tailwind.config` file — configuration is in CSS. Core palette defined in [src/app/globals.css](src/app/globals.css): background `#001919`, accent `#DEEE5A`, text `#FDFFE3`, blue `#286A7A`. Custom fonts (Unbounded, Outfit, Beiruti) loaded from `public/fonts/`.
