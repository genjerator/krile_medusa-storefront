import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cardClass } from "@modules/home/components/category-cards"

/**
 * Subcategory cards shown above the product grid on a category page — one card
 * per (visible) child category. Same visual style as the homepage category
 * cards; shows the admin-uploaded category image (metadata.image) full-bleed
 * across the whole card, with a white gradient scrim between the image and the
 * text so the copy stays readable even at full image opacity.
 */
export default function SubcategoryCards({
  subcategories,
}: {
  subcategories: HttpTypes.StoreProductCategory[]
}) {
  if (!subcategories.length) return null

  // With exactly 4 subcategories, fit them on a single desktop row (4 cols);
  // otherwise keep the default 3-per-row layout. Mobile stays 2 columns.
  const desktopCols =
    subcategories.length === 4 ? "medium:grid-cols-4" : "medium:grid-cols-3"

  return (
    <div className="content-container pt-6">
      <div className={`grid grid-cols-2 ${desktopCols} auto-rows-fr gap-4`}>
        {subcategories.map((sub) => {
          const rawImage = (sub.metadata as Record<string, unknown> | null)?.image
          const image = typeof rawImage === "string" && rawImage ? rawImage : null

          return (
            <LocalizedClientLink
              key={sub.id}
              href={`/categories/${sub.handle}`}
              className={cardClass}
            >
              <div className="relative z-10">
                <h3
                  className="font-heading text-xl font-bold leading-tight tracking-tight mb-3"
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

              {image && (
                <>
                  <div className="pointer-events-none absolute inset-0 z-0">
                    <Image
                      src={image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Readability scrim: a white gradient between the image and
                      the text (strongest at the top-left, where the heading and
                      description sit) so the copy stays legible even when the
                      image behind it is fully opaque. */}
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-white/90 via-white/60 to-white/20 group-hover:via-white/50 transition-colors duration-300" />
                </>
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}
