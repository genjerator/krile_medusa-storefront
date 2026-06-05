import { notFound } from "next/navigation"
import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ProductsGrid from "@modules/products/templates/products-grid"
import ProductCount from "@modules/products/templates/product-count"
import SortSelect from "@modules/products/components/sort-select"
import StoreSidebar from "@modules/store/components/store-sidebar"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents: HttpTypes.StoreProductCategory[] = []
  const getParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      getParents(cat.parent_category)
    }
  }
  getParents(category)

  // Collect this category + all descendant IDs so parent shows children's products
  const getAllCategoryIds = (cat: HttpTypes.StoreProductCategory): string[] => {
    const ids = [cat.id]
    if (cat.category_children?.length) {
      cat.category_children.forEach((child) => ids.push(...getAllCategoryIds(child)))
    }
    return ids
  }
  const categoryIds = getAllCategoryIds(category)

  return (
    <div>
      {/* Header banner */}
      <div className="sticky top-16 z-40 bg-brand-navy text-white py-6 medium:py-10 pt-0">
        <div className="content-container">
          <h1 className="text-2xl medium:text-4xl font-bold mb-1 medium:mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {category.description}
            </p>
          )}

          {/* Breadcrumb + count + sort inside blue bar */}
          <div className="flex items-center justify-between mt-4 gap-6 medium:gap-8">
            <div className="flex items-center gap-4 flex-1 min-w-0 flex-wrap">
              <nav className="flex items-center gap-2 text-sm text-white/60 flex-wrap">
                <LocalizedClientLink href="/" className="hover:text-white transition-colors">
                  Startseite
                </LocalizedClientLink>
                <span>›</span>
                <LocalizedClientLink href="/products" className="hover:text-white transition-colors">
                  Produkte
                </LocalizedClientLink>
                {parents.reverse().map((parent) => (
                  <React.Fragment key={parent.id}>
                    <span>›</span>
                    <LocalizedClientLink
                      href={`/categories/${parent.handle}`}
                      className="hover:text-white transition-colors"
                    >
                      {parent.name}
                    </LocalizedClientLink>
                  </React.Fragment>
                ))}
                <span>›</span>
                <span className="text-white/90 font-medium">{category.name}</span>
              </nav>
              <Suspense fallback={null}>
                <span className="text-white/60">
                  <ProductCount
                    sortBy={sort}
                    page={pageNumber}
                    countryCode={countryCode}
                    categoryId={categoryIds}
                  />
                </span>
              </Suspense>
            </div>
            <SortSelect sortBy={sort} />
          </div>
        </div>
      </div>

      <div className="content-container py-4 medium:py-6">

        {/* Subcategories — aligned with product grid */}
        {(category.category_children?.length ?? 0) > 0 && (
          <div className="flex gap-6 medium:gap-8 mb-6">
            <div className="hidden medium:block medium:w-56 medium:shrink-0" />
            <div className="flex gap-2 flex-wrap flex-1">
              {category.category_children!.map((child) => (
                <LocalizedClientLink
                  key={child.id}
                  href={`/categories/${child.handle}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-full border border-ui-border-base bg-white hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  {child.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="flex flex-col medium:flex-row gap-6 medium:gap-8">
          {/* Products grid — top on mobile */}
          <div className="flex-1 min-w-0 order-1 medium:order-2">
            <Suspense fallback={<SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />}>
              <ProductsGrid
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                categoryId={categoryIds}
              />
            </Suspense>
          </div>

          {/* Sidebar — bottom on mobile */}
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
