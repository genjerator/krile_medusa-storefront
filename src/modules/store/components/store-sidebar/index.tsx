import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default async function StoreSidebar() {
  const categories = await listCategories()
  const hasProducts = (cat: HttpTypes.StoreProductCategory): boolean => {
    const direct = (cat as any).products?.length > 0
    const fromChildren = (cat as any).category_children?.some((child: HttpTypes.StoreProductCategory) =>
      (child as any).products?.length > 0
    )
    return direct || fromChildren
  }

  const rootCategories = categories
    .filter((c: HttpTypes.StoreProductCategory) => !c.parent_category_id)
    .filter(hasProducts)

  return (
    <aside className="w-64 shrink-0">
      {/* KATEGORIEN */}
      <div className="mb-6">
        <h3 className="text-xs font-bold tracking-widest text-ui-fg-muted uppercase mb-3">
          Kategorien
        </h3>
        <ul className="space-y-1">
          {rootCategories.map((cat: HttpTypes.StoreProductCategory) => (
            <li key={cat.id}>
              <LocalizedClientLink
                href={`/categories/${cat.handle}`}
                className="flex items-center justify-between py-1.5 px-2 rounded text-sm text-ui-fg-base hover:bg-ui-bg-subtle hover:text-blue-600 transition-colors group"
              >
                <span className="font-medium">{cat.name}</span>
                {(cat as any).products?.length > 0 && (
                  <span className="text-xs text-ui-fg-muted bg-ui-bg-subtle px-1.5 py-0.5 rounded">
                    {(cat as any).products?.length}
                  </span>
                )}
              </LocalizedClientLink>
              {(cat as any).category_children?.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1">
                  {(cat as any).category_children.filter((child: HttpTypes.StoreProductCategory) => (child as any).products?.length > 0).map((child: HttpTypes.StoreProductCategory) => (
                    <li key={child.id}>
                      <LocalizedClientLink
                        href={`/categories/${child.handle}`}
                        className="flex items-center justify-between py-1 px-2 rounded text-sm text-ui-fg-subtle hover:text-blue-600 transition-colors"
                      >
                        <span>{child.name}</span>
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

    </aside>
  )
}
