# Project Overview

_Last updated: 2026-04-19 by planner after task: add FeaturedFour 4-product grid section below Hero on home page_

## Language(s)
- TypeScript: `tsconfig.json` — standarts: `/home/genjerator/.claude/skills/ts-code-standarts.md`

## Key Files
| File | Purpose |
|------|---------|
| `src/modules/home/components/hero/index.tsx` | Full-width hero slider (client component, 3 slides, auto-play, arrows, dots) |
| `src/modules/home/components/featured-four/index.tsx` | 4-product grid section shown below Hero (server component, fetches 4 products, "Featured Products" heading, "View all" → /store) |
| `src/modules/home/components/featured-products/index.tsx` | Renders a `ProductRail` per collection; accepts `collections` + `region` |
| `src/modules/home/components/featured-products/product-rail/index.tsx` | Single collection rail — calls `listProducts`, renders `content-container` wrapper + `ProductPreview` grid |
| `src/modules/products/components/product-preview/index.tsx` | Single product card — `{ product, isFeatured?, region }` → thumbnail + title + price |
| `src/modules/common/components/interactive-link/index.tsx` | Styled link with arrow icon; uses `LocalizedClientLink` internally |
| `src/lib/data/products.ts` | `listProducts({ pageParam, queryParams, countryCode, regionId })` — server action, fetches from `/store/products` |
| `src/app/[countryCode]/(main)/page.tsx` | Home page — renders `<Hero />`, `<FeaturedFour />`, then `<FeaturedProducts />` |
| `tailwind.config.js` | Tailwind config with `@medusajs/ui-preset`, custom screens (small=1024px), custom grey palette |
| `next.config.js` | Next.js 15 config |
| `tsconfig.json` | Strict TypeScript, `baseUrl: ./src`, path aliases `@lib/*`, `@modules/*`, `@pages/*` |

## Architecture & Conventions
- Feature-based module structure under `src/modules/<feature>/components/<name>/index.tsx`
- Interactive (client) components use `"use client"` directive at top of file; data-fetching components are plain async functions (server components)
- Static data is declared outside the component to avoid re-creation on render
- No explicit return type annotations on React components (inferred); handlers annotate `: void`
- `@medusajs/ui` provides `Button`, `Heading`, `Text` and other UI primitives — prefer over raw HTML equivalents
- `@medusajs/types` (`HttpTypes`) provides all store types — `StoreProduct`, `StoreRegion`, `StoreCollection`
- Tailwind `small:` breakpoint = 1024px (not the default `sm:`)
- No external slider/carousel libraries — custom implementations use pure Tailwind + React state
- Product grids use `content-container py-12 small:py-24` outer wrapper and `grid-cols-2 small:grid-cols-N` for the list
- `listProducts` requires either `countryCode` or `regionId`; always include `fields: "*variants.calculated_price"` in queryParams for price display
- `InteractiveLink` (not raw `<a>`) is the standard "View all" link pattern across product sections

## Do Not Touch
- `src/app/[countryCode]/(main)/page.tsx`: only edit to add/remove top-level section components; do not restructure the file

## Known Constraints
- Pre-existing TypeScript errors exist in several files unrelated to current tasks (checkout, product page, line-item price) — do not treat these as regressions
- `JSX.Element` return type on components causes `TS2503` (no JSX namespace in scope) — omit explicit component return types
- `@medusajs/ui-preset` is required in `tailwind.config.js` for `ui-*` design token classes to resolve
- `listProducts` throws if neither `countryCode` nor `regionId` is provided — always pass one
