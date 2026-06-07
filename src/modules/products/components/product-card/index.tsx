import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default async function ProductCard({
  product,
  region,
  isNew,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isNew?: boolean
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const thumbnail = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink
      href={`/product/${product.handle}`}
      className="group bg-white rounded-xl border border-blue-100 shadow-[0_2px_12px_rgba(15,30,70,0.08)] hover:border-blue-300 hover:shadow-[0_10px_32px_rgba(15,30,70,0.18)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative bg-ui-bg-subtle group-hover:bg-white transition-colors duration-300 p-4 aspect-[4/3] overflow-hidden">
        {isNew && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center bg-brand-navy text-white text-[10px] font-heading font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full shadow-sm">
            Neu
          </span>
        )}
        <div className="relative w-full h-full">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title ?? ""}
              fill
              className="object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, 400px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ui-fg-muted">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {product.collection && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-px bg-blue-200 group-hover:bg-blue-400 group-hover:w-6 transition-all duration-300" />
            <span className="text-[10px] font-heading font-semibold uppercase tracking-[0.18em] text-ui-fg-muted group-hover:text-blue-600 transition-colors duration-300">
              {product.collection.title}
            </span>
          </div>
        )}

        <h3 className="font-bold text-sm text-brand-navy leading-snug mb-3 line-clamp-2 tracking-tight group-hover:text-blue-700 transition-colors duration-200">
          {product.title}
        </h3>

        {/* Price + arrow */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 group-hover:border-blue-100 transition-colors duration-300">
          {cheapestPrice && (
            <p className="font-heading text-lg font-bold text-blue-700 tracking-tight">
              {cheapestPrice.calculated_price}
            </p>
          )}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ui-bg-subtle text-ui-fg-muted group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
