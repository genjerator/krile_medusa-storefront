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
      className="group bg-white rounded-lg border border-ui-border-base hover:border-blue-200 hover:shadow-md hover:bg-ui-bg-subtle transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative bg-ui-bg-subtle group-hover:bg-white transition-colors duration-200 p-4 aspect-[4/3]">
        <div className="relative w-full h-full">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title ?? ""}
              fill
              className="object-contain"
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
        <h3 className="font-bold text-sm text-ui-fg-base leading-tight mb-3 line-clamp-2">
          {product.title}
        </h3>

        {/* Price + arrow */}
        <div className="mt-auto flex items-center justify-between">
          {cheapestPrice && (
            <p className="text-lg font-bold text-blue-700">
              {cheapestPrice.calculated_price}
            </p>
          )}
          <span className="text-ui-fg-muted group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
