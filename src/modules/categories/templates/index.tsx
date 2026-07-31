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
import SearchBox from "@modules/store/components/search-box"
import { descriptionToHtml } from "@lib/util/description-html"
import { getSectionComponent } from "@modules/categories/templates/sections"
import SubcategoryCards from "@modules/categories/components/subcategory-cards"

// On this parent category, show a curated set of subcategory cards (in the
// given order) above the products.
const CURATED_SUBCATEGORIES: Record<string, string[]> = {
  "vakuum-maschinen": ["p-serie", "c-serie"],
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  q,
  countryCode,
  topBlockHtml,
  topBlockKey,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  q?: string
  countryCode: string
  /** Optional CMS content block rendered above the category header. */
  topBlockHtml?: string | null
  /** Key of the top block, used to pick its render mode. */
  topBlockKey?: string | null
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "price_asc"

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

  // Curated subcategory cards for this category (ordered by CURATED_SUBCATEGORIES).
  const curatedHandles = CURATED_SUBCATEGORIES[category.handle] ?? []
  const curatedSubcategories = curatedHandles
    .map((h) => category.category_children?.find((c) => c.handle === h))
    .filter((c): c is HttpTypes.StoreProductCategory => Boolean(c))

  // A `section-*` metadata value resolves to a code-driven section template;
  // otherwise the DB content block's HTML (topBlockHtml) is rendered plain.
  const TopSection = getSectionComponent(topBlockKey)
  const topLocale = countryCode.slice(0, 2).toLowerCase()

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
        </div>
      </div>

      {/* Curated subcategory cards above the products (e.g. P-Serie / C-Serie) */}
      <SubcategoryCards subcategories={curatedSubcategories} />

      <div className="content-container py-4 medium:py-6">


        {/* Main layout */}
        <div className="flex flex-col medium:flex-row gap-6 medium:gap-8">
          {/* Products grid — below categories on mobile */}
          <div className="flex-1 min-w-0 order-2">
            <Suspense fallback={<SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />}>
              {/* Optional content pinned above the products (admin-managed via the
          category's `content_block_top` metadata key). A `section-*` value
          renders a code-driven section template; any other value renders the
          DB content block's HTML. */}
              {TopSection ? (
                <div className="py-8">
                  <TopSection locale={topLocale} />
                </div>
              ) : topBlockHtml ? (
                <div className="py-8">
                  <div
                    className="max-w-3xl text-ui-fg-base [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:font-semibold [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-ui-border-base [&_th]:bg-ui-bg-subtle [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-ui-border-base [&_td]:px-3 [&_td]:py-2 [&_td]:align-top"
                    dangerouslySetInnerHTML={{ __html: descriptionToHtml(topBlockHtml) }}
                  />
                </div>
              ) : null}
              <ProductsGrid
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                categoryId={categoryIds}
                q={q}
              />
            </Suspense>
          </div>

          {/* Sidebar — between blue bar and grid on mobile, left on desktop */}
          <div className="order-1 medium:w-56 medium:shrink-0">
            <Suspense fallback={null}>
              <StoreSidebar activeHandle={category.handle} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
