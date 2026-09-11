export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductsTemplate from "@modules/products/templates/products-template"
import { getProductTagByValue } from "@lib/data/products"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
    tag: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { tag } = await props.params
  const value = decodeURIComponent(tag)
  return {
    title: `${value} | Produkte`,
    description: `Produkte für ${value}.`,
  }
}

export default async function ProductsByTagPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams
  const value = decodeURIComponent(params.tag)

  const tag = await getProductTagByValue(value)
  if (!tag) notFound()

  return (
    <ProductsTemplate
      sortBy={sortBy}
      page={page}
      q={q}
      countryCode={params.countryCode}
      tagId={tag.id}
      tagLabel={tag.value}
    />
  )
}
