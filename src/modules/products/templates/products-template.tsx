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

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Breadcrumb + sort */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-sm text-ui-fg-muted">
            <LocalizedClientLink href="/" className="hover:text-ui-fg-base transition-colors">
              Startseite
            </LocalizedClientLink>
            <span>›</span>
            <span className="text-ui-fg-base font-medium">Produkte</span>
          </nav>
          <div className="flex items-center gap-3">
            <select className="text-sm border border-ui-border-base rounded px-3 py-2 bg-white text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-blue-600">
              <option>Neueste zuerst</option>
              <option>Preis aufsteigend</option>
              <option>Preis absteigend</option>
            </select>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-8">
          <Suspense fallback={<div className="w-64 shrink-0" />}>
            <StoreSidebar />
          </Suspense>

          <div className="flex-1 min-w-0">
            <Suspense fallback={<SkeletonProductGrid />}>
              <ProductsGrid
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
