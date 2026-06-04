import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export default async function ProductCount({
  sortBy,
  page,
  countryCode,
  categoryId,
}: {
  sortBy?: SortOptions
  page: number
  countryCode: string
  categoryId?: string | string[]
}) {
  const region = await getRegion(countryCode)
  if (!region) return null

  const queryParams: Record<string, unknown> = { limit: 1 }
  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId) ? categoryId : [categoryId]
  }

  const {
    response: { count },
  } = await listProductsWithSort({ page, queryParams, sortBy, countryCode })

  return <span className="text-sm text-ui-fg-muted">{count} Produkte gefunden</span>
}
