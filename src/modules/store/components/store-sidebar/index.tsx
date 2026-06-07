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
      <div className="flex items-center gap-2 mb-4">
        <span className="w-5 h-px bg-blue-300" />
        <h3 className="font-heading text-xs font-semibold tracking-[0.22em] text-brand-navy uppercase">
          Kategorien
        </h3>
      </div>

      {/* Mobile: horizontal scrollable chips */}
      <div className="medium:hidden flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {rootCategories.map((cat: HttpTypes.StoreProductCategory) => (
          <LocalizedClientLink
            key={cat.id}
            href={`/categories/${cat.handle}`}
            className="shrink-0 font-heading text-sm font-medium px-4 py-2 rounded-full border border-blue-100 bg-white shadow-sm hover:border-blue-400 hover:text-blue-600 hover:shadow-[0_4px_14px_rgba(15,30,70,0.12)] transition-all duration-200 whitespace-nowrap"
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
              className="group flex items-center justify-between py-2 px-2.5 rounded-lg text-sm text-ui-fg-base hover:bg-blue-50/70 hover:text-blue-700 transition-all duration-200"
            >
              <span className="font-heading font-medium tracking-wide flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-200 group-hover:bg-blue-600 group-hover:scale-125 transition-all duration-200" />
                {cat.name}
              </span>
              {(cat as any).products?.length > 0 && (
                <span className="text-xs text-ui-fg-muted bg-ui-bg-subtle group-hover:bg-white group-hover:text-blue-600 px-1.5 py-0.5 rounded-full transition-colors duration-200">
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
                className="group/child flex items-center gap-2.5 py-1.5 px-2.5 ml-3 rounded-lg text-sm text-ui-fg-subtle hover:bg-blue-50/50 hover:text-blue-600 transition-all duration-200"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300 group-hover/child:bg-blue-500 transition-colors duration-200" />
                {child.name}
              </LocalizedClientLink>
            ))}
          </li>
        ))}
      </ul>
    </aside>
  )
}
