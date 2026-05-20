import { Suspense } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHero from "@modules/store/components/store-hero"
import StoreSidebar from "@modules/store/components/store-sidebar"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductsGrid from "./products-grid"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function ProductsTemplate({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div>
      <StoreHero />

      <div className="max-w-[1400px] mx-auto px-4 medium:px-6 py-4 medium:py-6">

        {/* Breadcrumb + sort bar */}
        <div className="flex items-center justify-between mb-4 medium:mb-6">
          <nav className="flex items-center gap-2 text-sm text-ui-fg-muted">
            <LocalizedClientLink href="/" className="hover:text-ui-fg-base transition-colors">
              Startseite
            </LocalizedClientLink>
            <span>›</span>
            <span className="text-ui-fg-base font-medium">Produkte</span>
          </nav>
          <select className="text-sm border border-ui-border-base rounded px-3 py-2 bg-white text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-blue-600">
            <option>Neueste zuerst</option>
            <option>Preis aufsteigend</option>
            <option>Preis absteigend</option>
          </select>
        </div>

        {/* Main layout: grid first, sidebar below on mobile / left on desktop */}
        <div className="flex flex-col medium:flex-row gap-6 medium:gap-8">

          {/* Products grid — order-1 on mobile (top), natural order on desktop */}
          <div className="flex-1 min-w-0 order-1 medium:order-2">
            <Suspense fallback={<SkeletonProductGrid />}>
              <ProductsGrid
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>

          {/* Sidebar (Kategorien) — order-2 on mobile (bottom), left on desktop */}
          <div className="order-2 medium:order-1 medium:w-56 medium:shrink-0">
            <Suspense fallback={null}>
              <StoreSidebar />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  )
}
