import { Suspense } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHero from "@modules/store/components/store-hero"
import StoreSidebar from "@modules/store/components/store-sidebar"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductsGrid from "./products-grid"
import ProductCount from "./product-count"
import SortSelect from "@modules/products/components/sort-select"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SearchBox from "@modules/store/components/search-box"
import CategoryCards from "@modules/home/components/category-cards"

export default function ProductsTemplate({
  sortBy,
  page,
  q,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  q?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "price_asc"

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
                  q={q}
                />
              </span>
            </Suspense>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Suspense fallback={null}>
              <SearchBox />
            </Suspense>
            <Suspense fallback={null}>
              <SortSelect sortBy={sort} />
            </Suspense>
          </div>
        </div>
      </StoreHero>

      {/* Category section — above the product grid */}
      <div className="pt-4 medium:pt-6">
        <CategoryCards />
      </div>

      <div className="content-container py-4 medium:py-6">

        {/* Main layout: grid first, sidebar below on mobile / left on desktop */}
        <div className="flex flex-col medium:flex-row gap-6 medium:gap-8">

          {/* Products grid — below categories on mobile, right on desktop */}
          <div className="flex-1 min-w-0 order-2">
            <Suspense fallback={<SkeletonProductGrid />}>
              <ProductsGrid
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                q={q}
              />
            </Suspense>
          </div>

          {/* Sidebar (Kategorien) — between blue bar and grid on mobile, left on desktop */}
          <div className="order-1 medium:w-56 medium:shrink-0">
            <Suspense fallback={null}>
              <StoreSidebar />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  )
}
