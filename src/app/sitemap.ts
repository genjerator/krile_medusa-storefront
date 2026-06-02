import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { sdk } from "@lib/config"

const BASE_URL = getBaseURL()
const LOCALE = "de"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/${LOCALE}`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/${LOCALE}/products`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE_URL}/${LOCALE}/store`, priority: 0.8, changeFrequency: "daily" },
    { url: `${BASE_URL}/${LOCALE}/kontakt`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/${LOCALE}/service`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/${LOCALE}/training`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/${LOCALE}/informations`, priority: 0.5, changeFrequency: "monthly" },
  ]

  const productPages = await sdk.client
    .fetch<{ products: { handle: string; updated_at: string }[] }>("/store/products", {
      query: { fields: "handle,updated_at", limit: 500 },
      cache: "no-store",
    })
    .then(({ products }) =>
      products.map((p) => ({
        url: `${BASE_URL}/${LOCALE}/products/${p.handle}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )
    .catch(() => [])

  const categoryPages = await sdk.client
    .fetch<{ product_categories: { handle: string }[] }>("/store/product-categories", {
      query: { fields: "handle", limit: 100 },
      cache: "no-store",
    })
    .then(({ product_categories }) =>
      product_categories.map((c) => ({
        url: `${BASE_URL}/${LOCALE}/categories/${c.handle}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
    .catch(() => [])

  return [...staticPages, ...productPages, ...categoryPages]
}
