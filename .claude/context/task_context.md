# Task Context

## Language
TypeScript — standarts from `/home/genjerator/.claude/skills/ts-code-standarts.md`

## Key standarts for This Task

- No `any` — use `HttpTypes.StoreProduct` and `HttpTypes.StoreRegion` from `@medusajs/types`
- No explicit return type on the React component (inferred); prop shapes typed inline
- Use `type` (not `interface`) for prop shapes
- Organize by feature: new file goes to `src/modules/home/components/featured-four/index.tsx`
- Max ~20-30 lines per function, single responsibility
- Async server components — always `await` data fetches, never leave unhandled promises

## Task
Create a new `FeaturedFour` async server component that fetches the first 4 products and renders them
in a 4-column grid with a "Featured Products" heading and a "View all" link to `/store`, then insert
it in the home page between `<Hero />` and the existing `<FeaturedProducts />` section.

## Plan
1. Create `src/modules/home/components/featured-four/index.tsx`
   - async server component (no `"use client"`)
   - accepts `{ region: HttpTypes.StoreRegion }`
   - calls `listProducts({ regionId: region.id, queryParams: { limit: 4, fields: "*variants.calculated_price" } })`
   - returns `null` if products array is empty
   - renders `content-container py-12 small:py-24` wrapper (matches product-rail)
   - heading row: `Text` (txt-xlarge) "Featured Products" left + `InteractiveLink` href="/store" "View all" right
   - grid: `ul` with `grid-cols-2 small:grid-cols-4` containing one `ProductPreview` per `li`
2. Edit `src/app/[countryCode]/(main)/page.tsx`
   - add import for `FeaturedFour` from `@modules/home/components/featured-four`
   - render `<FeaturedFour region={region} />` between `<Hero />` and the existing `<div className="py-12">` wrapper

## Files to Change
- `src/modules/home/components/featured-four/index.tsx`: **create** — new component (does not exist yet)
- `src/app/[countryCode]/(main)/page.tsx`: **edit** — add import and insert `<FeaturedFour region={region} />`

## Exact Signatures

```tsx
// src/modules/home/components/featured-four/index.tsx

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type FeaturedFourProps = {
  region: HttpTypes.StoreRegion
}

export default async function FeaturedFour({ region }: FeaturedFourProps) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">Featured Products</Text>
        <InteractiveLink href="/store">View all</InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-24 small:gap-y-36">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
```

```tsx
// src/app/[countryCode]/(main)/page.tsx — after edit

import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import FeaturedFour from "@modules/home/components/featured-four"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <FeaturedFour region={region} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
```

## Types Needed

- `HttpTypes.StoreProduct` — from `@medusajs/types` — shape of each product in the grid
- `HttpTypes.StoreRegion` — from `@medusajs/types` — required by both `listProducts` and `ProductPreview`
- `listProducts` return type: `{ response: { products: HttpTypes.StoreProduct[], count: number }, nextPage: number | null }`

## Patterns to Follow

```tsx
// From src/modules/home/components/featured-products/product-rail/index.tsx:1-47
// Shows: calling listProducts, destructuring response.products, content-container wrapper,
// heading row with Text + InteractiveLink, grid ul, ProductPreview with isFeatured

import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
```

## Anti-patterns — Do NOT do this

- DO NOT use `"use client"` — this is a data-fetching server component; no interactivity required
- DO NOT call `listProducts` without `regionId` — the function throws `"Country code or region ID is required"` if neither is provided (seen in `src/lib/data/products.ts:25`)
- DO NOT omit `fields: "*variants.calculated_price"` from queryParams — `ProductPreview` calls `getProductPrice` which reads `variants.calculated_price`; without it prices will be missing
- DO NOT use only `grid-cols-4` — must be mobile-first: `grid-cols-2 small:grid-cols-4` (the `small:` breakpoint is 1024px per tailwind.config.js)
- DO NOT use a raw `<a>` or `<Link>` for "View all" — use `InteractiveLink` to match the existing arrow-icon style used in product-rail

## Public API Changes

No — internal component only; no exports to update.

## Edge Cases to Handle

- Empty products array (`products.length === 0`): return `null` — same guard pattern as product-rail line 25-27
- Fewer than 4 products returned: grid renders whatever count is returned — CSS grid handles sparse items gracefully, no special logic needed

## Self-critique Notes

Phase 3 review — issues found and fixed:

1. **`fields` param is critical** — `ProductPreview` calls `getProductPrice` which requires `variants.calculated_price` to be present on the product. Without `fields: "*variants.calculated_price"` in queryParams, prices would silently be undefined. Added to plan, signature, and anti-patterns.

2. **Mobile-first grid** — task says "4-column grid" but the codebase uses `small:` (1024px) as the wide breakpoint. Base must be `grid-cols-2`, wide is `small:grid-cols-4`. Added explicit anti-pattern warning.

3. **`InteractiveLink` for "View all"** — confirmed the existing product-rail uses `InteractiveLink` (not plain `<a>` or `<Link>`) to get the arrow icon and interactive color. The new component must match this.

4. **`isFeatured` prop** — `ProductPreview` accepts optional `boolean isFeatured`. Product-rail passes it; new component should too for correct thumbnail treatment.

5. **`region` null guard** — `FeaturedFour` is rendered only after the `if (!collections || !region) return null` check in `page.tsx`, so `region` is guaranteed non-null at the call site. No redundant guard needed inside the component.

Draft was accurate on structure; fixed fields, grid columns, and link component details in revision.

## File Contents

### src/modules/home/components/featured-products/product-rail/index.tsx  [reference only — not changed]

```tsx
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
```

### src/app/[countryCode]/(main)/page.tsx  [file to edit — full current contents]

```tsx
import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
```
