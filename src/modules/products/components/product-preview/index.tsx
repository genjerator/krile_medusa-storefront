import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/product/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="flex flex-col">
        <h3
          className="text-center font-semibold text-base text-ui-fg-base mb-3 leading-tight line-clamp-2 tracking-tight"
          data-testid="product-title"
        >
          {product.title}
        </h3>
        <div className="relative rounded-large overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {/* Subtitle overlay — revealed on hover */}
          {product.subtitle?.trim() && (
            <div className="absolute inset-0 z-10 flex items-end p-4 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs leading-snug line-clamp-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                {product.subtitle}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center mt-3 gap-y-1">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          {product.collection && (
            <span className="text-xs text-ui-fg-muted uppercase tracking-widest">
              {product.collection.title}
            </span>
          )}
          {product.variants && product.variants.length > 1 && (
            <span className="text-xs text-ui-fg-muted">
              {product.variants.length} options
            </span>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
