export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories, listCategoryIdsWithProducts } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getContentBlock } from "@lib/data/content-blocks"
import { toMetaDescription } from "@lib/util/description-html"
import { isSectionValue } from "@modules/categories/templates/sections"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
}

export async function generateStaticParams() {
  return []

  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const description =
      toMetaDescription(productCategory.description) ||
      `${productCategory.name} von Planeta Industries – jetzt im Shop entdecken.`

    return {
      title: productCategory.name,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, q } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  // Category IDs that actually have products (in this sales channel) — used to
  // hide subcategory cards for empty subcategories.
  const categoryIdsWithProducts = await listCategoryIdsWithProducts()

  // Optional content pinned to the top of this category, bound via the
  // category's `content_block_top` metadata key (set in admin). Locale follows
  // the URL's countryCode (de/en/it). A `section-*` value selects a code-driven
  // section template (resolved in CategoryTemplate); any other value is a DB
  // content block fetched here.
  const topBlockKey = (productCategory.metadata?.content_block_top as string) || null
  const topBlock =
    topBlockKey && !isSectionValue(topBlockKey)
      ? await getContentBlock(topBlockKey, params.countryCode.slice(0, 2).toLowerCase())
      : null

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      q={q}
      countryCode={params.countryCode}
      topBlockHtml={topBlock?.body || null}
      topBlockKey={topBlockKey}
      categoryIdsWithProducts={categoryIdsWithProducts}
    />
  )
}
