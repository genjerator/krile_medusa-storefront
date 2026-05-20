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
  const metadata = (product as any).metadata ?? {}
  const thumbnail = product.thumbnail || product.images?.[0]?.url

  return (
    <div className="bg-white rounded-lg border border-ui-border-base hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative bg-ui-bg-subtle p-4 aspect-[4/3]">
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

        {/* Specs */}
        {(metadata.sealing_bars || metadata.vacuum_pump_m3h) && (
          <div className="flex items-center gap-4 mb-3 text-xs text-ui-fg-subtle">
            {metadata.sealing_bars && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{metadata.sealing_bars}</span>
              </div>
            )}
            {metadata.vacuum_pump_m3h && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{metadata.vacuum_pump_m3h} m³/h</span>
              </div>
            )}
          </div>
        )}

        {/* Price + buttons */}
        <div className="mt-auto">
          {cheapestPrice && (
            <div className="mb-3">
              <p className="text-lg font-bold text-blue-700">
                {cheapestPrice.calculated_price}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <LocalizedClientLink
              href={`/product/${product.handle}`}
              className="flex-1 flex items-center justify-between px-3 py-2 text-sm border border-ui-border-base rounded hover:bg-ui-bg-subtle transition-colors text-ui-fg-base"
            >
              <span>Details ansehen</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink
              href={`/product/${product.handle}`}
              className="bg-brand-navy text-white px-3 py-2 rounded hover:bg-blue-900 transition-colors shrink-0"
              aria-label="In den Warenkorb"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
