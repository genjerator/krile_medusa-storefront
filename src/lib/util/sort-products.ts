import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

interface MinPricedProduct extends HttpTypes.StoreProduct {
  // undefined = no price set on any variant
  _minPrice?: number
}

// Newest first (descending created_at)
function byNewest(a: HttpTypes.StoreProduct, b: HttpTypes.StoreProduct): number {
  return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
}

/**
 * Helper function to sort products by price until the store API supports sorting by price
 * @param products
 * @param sortBy
 * @returns products sorted by price
 */
export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  let sortedProducts = products as MinPricedProduct[]

  if (["price_asc", "price_desc"].includes(sortBy)) {
    // Precompute the minimum set price for each product; leave undefined when no
    // variant has a price so we can order those separately.
    sortedProducts.forEach((product) => {
      const amounts = (product.variants ?? [])
        .map((variant) => variant?.calculated_price?.calculated_amount)
        .filter((amount): amount is number => typeof amount === "number")

      product._minPrice = amounts.length ? Math.min(...amounts) : undefined
    })

    // Sort by price; products without a set price go last and, among themselves,
    // are ordered newest first. Priced products with an equal price also fall
    // back to newest first.
    sortedProducts.sort((a, b) => {
      const aHasPrice = a._minPrice !== undefined
      const bHasPrice = b._minPrice !== undefined

      if (!aHasPrice && !bHasPrice) return byNewest(a, b)
      if (!aHasPrice) return 1
      if (!bHasPrice) return -1

      const diff = a._minPrice! - b._minPrice!
      if (diff === 0) return byNewest(a, b)
      return sortBy === "price_asc" ? diff : -diff
    })
  }

  if (sortBy === "created_at") {
    sortedProducts.sort(byNewest)
  }

  return sortedProducts
}
