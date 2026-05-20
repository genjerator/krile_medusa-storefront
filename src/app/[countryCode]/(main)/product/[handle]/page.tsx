export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductDetailTemplate from "@modules/products/templates/product-detail-template"
import { HttpTypes } from "@medusajs/types"

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
    title: `${product.title} | Planeta`,
    description: product.description ?? product.title,
    openGraph: {
      title: `${product.title} | Planeta`,
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
