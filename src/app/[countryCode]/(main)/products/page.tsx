export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductsTemplate from "@modules/products/templates/products-template"

export const metadata: Metadata = {
  title: "Produkte",
  description: "Entdecken Sie unsere hochwertigen Vakuumverpackungsmaschinen für professionelle Anwendungen.",
  openGraph: {
    title: "Produkte | planeta industries",
    description: "Entdecken Sie unsere hochwertigen Vakuumverpackungsmaschinen für professionelle Anwendungen.",
    url: "/products",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "planeta industries – Produktübersicht",
      },
    ],
  },
  twitter: {
    title: "Produkte | planeta industries",
    description: "Entdecken Sie unsere hochwertigen Vakuumverpackungsmaschinen.",
    images: ["/og-image.jpg"],
  },
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
