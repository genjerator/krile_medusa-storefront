import { Suspense } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHero from "@modules/store/components/store-hero"
import StoreSidebar from "@modules/store/components/store-sidebar"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductsGrid from "./products-grid"
import ProductCount from "./product-count"
import SortSelect from "@modules/products/components/sort-select"
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
      <StoreHero>
        {/* Breadcrumb + count + sort bar */}
        <div className="flex items-center justify-between mt-4 gap-6 medium:gap-8">
          <div className="flex items-center gap-4 flex-1 min-w-0 flex-wrap">
            <nav className="flex items-center gap-2 text-sm text-white/60 flex-wrap">
              <LocalizedClientLink href="/" className="hover:text-white transition-colors">
                Startseite
              </LocalizedClientLink>
              <span>›</span>
              <span className="text-white/90 font-medium">Produkte</span>
            </nav>
            <Suspense fallback={null}>
              <span className="text-white/60">
                <ProductCount
                  sortBy={sort}
                  page={pageNumber}
                  countryCode={countryCode}
                />
              </span>
            </Suspense>
          </div>
          <Suspense fallback={null}>
            <SortSelect sortBy={sort} />
          </Suspense>
        </div>
      </StoreHero>

      <div className="content-container py-4 medium:py-6">

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
