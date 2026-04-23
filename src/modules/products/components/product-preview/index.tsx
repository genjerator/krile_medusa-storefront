import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
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
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="flex flex-col">
        <h3
          className="text-center font-semibold text-base text-ui-fg-base mb-3 leading-tight line-clamp-2 tracking-tight"
          data-testid="product-title"
        >
          {product.title}
        </h3>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
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
