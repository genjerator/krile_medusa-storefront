import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cardClass } from "@modules/home/components/category-cards"

/**
 * Curated subcategory cards shown above the product grid on a category page.
 * Renders in the same visual style as the homepage category cards.
 */
export default function SubcategoryCards({
  subcategories,
}: {
  subcategories: HttpTypes.StoreProductCategory[]
}) {
  if (!subcategories.length) return null

  return (
    <div className="content-container pt-6">
      <div className="grid grid-cols-1 small:grid-cols-2 auto-rows-fr gap-4">
        {subcategories.map((sub) => (
          <LocalizedClientLink
            key={sub.id}
            href={`/categories/${sub.handle}`}
            className={cardClass}
          >
            <div className="relative z-10">
              <h3
                className="text-xl font-bold leading-tight tracking-tight mb-3"
                style={{ color: "#0F1E46" }}
              >
                {sub.name}
              </h3>
              {sub.description && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {sub.description}
                </p>
              )}
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
