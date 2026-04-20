import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type FeaturedFourProps = {
  region: HttpTypes.StoreRegion
}

export default async function FeaturedFour({ region }: FeaturedFourProps) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">Featured Products</Text>
        <InteractiveLink href="/store">View all</InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-24 small:gap-y-36">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
