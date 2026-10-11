// The (main) layout reads cookies() (cart/customer), so this route must render
// dynamically — keep force-dynamic to avoid any static-generation attempt (that
// caused a 500 previously). But force-dynamic also disables fetch caching by
// default, which made every request re-fetch from Medusa. fetchCache overrides
// that for THIS segment so the product data fetch is served from Next's Data
// Cache (Medusa untouched on repeat hits). Logged-in users carry an auth header,
// which Next won't cache — so they correctly bypass this.
export const dynamic = "force-dynamic"
export const fetchCache = "force-cache"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductDetailTemplate from "@modules/products/templates/product-detail-template"
import { HttpTypes } from "@medusajs/types"
import { toMetaDescription } from "@lib/util/description-html"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  if (!region) notFound()

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!product) notFound()

  return {
    title: product.title,
    description: toMetaDescription(product.description) || product.title,
    openGraph: {
      title: `${product.title} | Planeta Industries`,
      description: toMetaDescription(product.description) || product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  if (!region) notFound()

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      handle: params.handle,
      fields: "*categories,*variants,*variants.calculated_price,*images,*options,*options.values,+metadata",
    },
  }).then(({ response }) => response.products[0])

  if (!product) notFound()

  const images = product.images ?? []

  return (
    <ProductDetailTemplate
      product={product}
      region={region}
      countryCode={params.countryCode}
      images={images}
    />
  )
}
