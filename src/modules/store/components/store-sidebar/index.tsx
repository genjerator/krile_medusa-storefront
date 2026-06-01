import { listCategories, listCategoryIdsWithProducts } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function StoreSidebar() {
  const [categories, activeCategoryIds] = await Promise.all([
    listCategories(),
    listCategoryIdsWithProducts(),
  ])

  const hasProducts = (cat: HttpTypes.StoreProductCategory): boolean => {
    const direct = activeCategoryIds.has(cat.id)
    const fromChildren = (cat as any).category_children?.some(
      (child: HttpTypes.StoreProductCategory) => activeCategoryIds.has(child.id)
    )
    return direct || fromChildren
  }

  const rootCategories = categories
    .filter((c: HttpTypes.StoreProductCategory) => !c.parent_category_id)
    .filter(hasProducts)

  if (!rootCategories.length) return null

  return (
    <aside>
      <h3 className="text-xs font-bold tracking-widest text-ui-fg-muted uppercase mb-3">
        Kategorien
      </h3>

      {/* Mobile: horizontal scrollable chips */}
      <div className="medium:hidden flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {rootCategories.map((cat: HttpTypes.StoreProductCategory) => (
          <LocalizedClientLink
            key={cat.id}
            href={`/categories/${cat.handle}`}
            className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-full border border-ui-border-base bg-white hover:border-blue-600 hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            {cat.name}
          </LocalizedClientLink>
        ))}
      </div>

      {/* Desktop: vertical list */}
      <ul className="hidden medium:block space-y-1">
        {rootCategories.map((cat: HttpTypes.StoreProductCategory) => (
          <li key={cat.id}>
            <LocalizedClientLink
              href={`/categories/${cat.handle}`}
              className="flex items-center justify-between py-1.5 px-2 rounded text-sm text-ui-fg-base hover:bg-ui-bg-subtle hover:text-blue-600 transition-colors"
            >
              <span className="font-medium">{cat.name}</span>
              {(cat as any).products?.length > 0 && (
                <span className="text-xs text-ui-fg-muted bg-ui-bg-subtle px-1.5 py-0.5 rounded">
                  {(cat as any).products.length}
                </span>
              )}
            </LocalizedClientLink>
            {(cat as any).category_children?.filter(
              (child: HttpTypes.StoreProductCategory) => activeCategoryIds.has(child.id)
            ).map((child: HttpTypes.StoreProductCategory) => (
              <LocalizedClientLink
                key={child.id}
                href={`/categories/${child.handle}`}
                className="flex items-center py-1 px-2 ml-3 rounded text-sm text-ui-fg-subtle hover:text-blue-600 transition-colors"
              >
                {child.name}
              </LocalizedClientLink>
            ))}
          </li>
        ))}
      </ul>
    </aside>
  )
}
