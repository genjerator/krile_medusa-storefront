import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Returns the set of category IDs that have at least one product in the current
// sales channel (filtered automatically via the publishable API key).
export const listCategoryIdsWithProducts = async (): Promise<Set<string>> => {
  const next = { ...(await getCacheOptions("products")) }
  const limit = 500
  let offset = 0
  const categoryIds = new Set<string>()

  while (true) {
    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>("/store/products", {
      query: { fields: "*categories", limit, offset },
      next,
      cache: "force-cache",
    })

    for (const product of products) {
      for (const cat of (product as any).categories ?? []) {
        categoryIds.add(cat.id)
      }
    }

    if (products.length < limit) break
    offset += limit
  }

  return categoryIds
}

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
