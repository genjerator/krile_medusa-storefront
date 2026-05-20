export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductsTemplate from "@modules/products/templates/products-template"

export const metadata: Metadata = {
  title: "Produkte",
  description: "Entdecken Sie unsere hochwertigen Vakuumverpackungsmaschinen.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function ProductsPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <ProductsTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
