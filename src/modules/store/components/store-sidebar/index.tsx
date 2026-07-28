import { listCategories, listCategoryIdsWithProducts } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function StoreSidebar({
  activeHandle,
}: {
  /** Handle of the category currently being viewed, if any. */
  activeHandle?: string
}) {
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

  const isVisible = (cat: HttpTypes.StoreProductCategory) =>
    (cat as any).is_active !== false && (cat as any).is_internal !== true

  const rootCategories = categories
    .filter((c: HttpTypes.StoreProductCategory) => !c.parent_category_id)
    .filter(hasProducts)

  if (!rootCategories.length) return null

  // Resolve the current category and its top-level ancestor so we can mark the
  // selected main category and expand its subcategories.
  const byId = new Map(categories.map((c) => [c.id, c]))
  const current = activeHandle
    ? categories.find((c) => c.handle === activeHandle)
    : undefined

  const rootOf = (cat?: HttpTypes.StoreProductCategory) => {
    let node = cat
    while (node?.parent_category_id && byId.get(node.parent_category_id)) {
      node = byId.get(node.parent_category_id)
    }
    return node
  }
  const activeRoot = rootOf(current)

  const childrenOf = (cat?: HttpTypes.StoreProductCategory) =>
    ((cat?.category_children as HttpTypes.StoreProductCategory[]) ?? [])
      .map((child) => byId.get(child.id) ?? child)
      .filter(isVisible)
      .filter(hasProducts)

  const subcategories = childrenOf(activeRoot)

  return (
    <aside>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-5 h-px bg-blue-300" />
        <h3 className="font-heading text-xs font-semibold tracking-[0.22em] text-brand-navy uppercase">
          Kategorien
        </h3>
      </div>

      {/* Mobile: main categories, then subcategories of the selected one */}
      <div className="medium:hidden">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {rootCategories.map((cat: HttpTypes.StoreProductCategory) => {
            const selected = activeRoot?.id === cat.id
            return (
              <LocalizedClientLink
                key={cat.id}
                href={`/categories/${cat.handle}`}
                aria-current={selected ? "page" : undefined}
                className={`shrink-0 font-heading text-sm font-medium px-4 py-2 rounded-full border shadow-sm transition-all duration-200 whitespace-nowrap ${
                  selected
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-[0_4px_14px_rgba(15,30,70,0.12)]"
                    : "border-blue-100 bg-white hover:border-blue-400 hover:text-blue-600 hover:shadow-[0_4px_14px_rgba(15,30,70,0.12)]"
                }`}
              >
                {cat.name}
              </LocalizedClientLink>
            )
          })}
        </div>

        {subcategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mt-2 -mx-4 px-4">
            {subcategories.map((sub: HttpTypes.StoreProductCategory) => {
              const selected = current?.id === sub.id
              return (
                <LocalizedClientLink
                  key={sub.id}
                  href={`/categories/${sub.handle}`}
                  aria-current={selected ? "page" : undefined}
                  className={`shrink-0 font-heading text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
                    selected
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-blue-100 bg-blue-50/60 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {sub.name}
                </LocalizedClientLink>
              )
            })}
          </div>
        )}
      </div>

      {/* Desktop: vertical list; selected main expands its subcategories */}
      <ul className="hidden medium:block space-y-1">
        {rootCategories.map((cat: HttpTypes.StoreProductCategory) => {
          const selected = activeRoot?.id === cat.id
          const children = selected ? subcategories : childrenOf(cat)
          return (
            <li key={cat.id}>
              <LocalizedClientLink
                href={`/categories/${cat.handle}`}
                aria-current={selected ? "page" : undefined}
                className={`group flex items-center justify-between py-2 px-2.5 rounded-lg text-sm transition-all duration-200 ${
                  selected
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-ui-fg-base hover:bg-blue-50/70 hover:text-blue-700"
                }`}
              >
                <span className="font-heading font-medium tracking-wide flex items-center gap-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      selected
                        ? "bg-blue-600 scale-125"
                        : "bg-blue-200 group-hover:bg-blue-600 group-hover:scale-125"
                    }`}
                  />
                  {cat.name}
                </span>
                {(cat as any).products?.length > 0 && (
                  <span className="text-xs text-ui-fg-muted bg-ui-bg-subtle group-hover:bg-white group-hover:text-blue-600 px-1.5 py-0.5 rounded-full transition-colors duration-200">
                    {(cat as any).products.length}
                  </span>
                )}
              </LocalizedClientLink>
              {children.map((child: HttpTypes.StoreProductCategory) => {
                const childSelected = current?.id === child.id
                return (
                  <LocalizedClientLink
                    key={child.id}
                    href={`/categories/${child.handle}`}
                    aria-current={childSelected ? "page" : undefined}
                    className={`group/child flex items-center gap-2.5 py-1.5 px-2.5 ml-3 rounded-lg text-sm transition-all duration-200 ${
                      childSelected
                        ? "text-blue-600 font-medium"
                        : "text-ui-fg-subtle hover:bg-blue-50/50 hover:text-blue-600"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                        childSelected
                          ? "bg-blue-500"
                          : "bg-slate-300 group-hover/child:bg-blue-500"
                      }`}
                    />
                    {child.name}
                  </LocalizedClientLink>
                )
              })}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
