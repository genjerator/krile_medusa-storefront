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
import { listProducts, retrieveProductByHandleAnyStatus } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductDetailTemplate from "@modules/products/templates/product-detail-template"
import { HttpTypes } from "@medusajs/types"
import { toMetaDescription } from "@lib/util/description-html"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

const PRODUCT_FIELDS =
  "*categories,*variants,*variants.calculated_price,*images,*options,*options.values,+metadata"

// Load the product for the detail page. A published product is fetched the
// normal way (store API, status=published). If none matches, fall back to the
// any-status route so a DRAFT product is still viewable via its direct link —
// but flagged `orderable: false` so the page hides the "In den Warenkorb"
// button. A truly missing handle yields { product: null }.
async function loadProductForDetail(
  handle: string,
  countryCode: string
): Promise<{ product: HttpTypes.StoreProduct | null; orderable: boolean }> {
  const published = await listProducts({
    countryCode,
    queryParams: { handle, fields: PRODUCT_FIELDS },
  }).then(({ response }) => response.products[0])

  if (published) return { product: published, orderable: true }

  const draft = await retrieveProductByHandleAnyStatus({ handle, countryCode })
  if (draft) return { product: draft, orderable: false }

  return { product: null, orderable: false }
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  if (!region) notFound()

  const { product } = await loadProductForDetail(params.handle, params.countryCode)

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

  const { product, orderable } = await loadProductForDetail(
    params.handle,
    params.countryCode
  )

  if (!product) notFound()

  const images = product.images ?? []

  return (
    <ProductDetailTemplate
      product={product}
      region={region}
      countryCode={params.countryCode}
      images={images}
      orderable={orderable}
    />
  )
}
