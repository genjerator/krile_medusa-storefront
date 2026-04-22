"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  { value: "created_at", label: "Latest Arrivals" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <span className="text-sm text-ui-fg-muted whitespace-nowrap">Sort by</span>
      <select
        value={sortBy}
        onChange={(e) => setQueryParams("sortBy", e.target.value as SortOptions)}
        data-testid={dataTestId}
        className="text-sm border border-ui-border-base rounded-md px-3 py-1.5 bg-ui-bg-base text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-ui-border-interactive cursor-pointer"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortProducts
