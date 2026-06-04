import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Pagination } from "@modules/store/components/pagination"
import ProductCard from "@modules/products/components/product-card"

const PRODUCT_LIMIT = 12

export default async function ProductsGrid({
  sortBy,
  page,
  countryCode,
  categoryId,
}: {
  sortBy?: SortOptions
  page: number
  countryCode: string
  categoryId?: string | string[]
}) {
  const region = await getRegion(countryCode)

  if (!region) return null

  const queryParams: Record<string, unknown> = { limit: PRODUCT_LIMIT }

  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId) ? categoryId : [categoryId]
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>

      <ul
        className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-4"
        data-testid="products-list"
      >
        {products.map((p, i) => (
          <li key={p.id}>
            <ProductCard product={p} region={region} isNew={i < 2} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
