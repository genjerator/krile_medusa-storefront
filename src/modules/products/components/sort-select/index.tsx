"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

const options = [
  { value: "created_at", label: "Neueste zuerst" },
  { value: "price_asc", label: "Preis aufsteigend" },
  { value: "price_desc", label: "Preis absteigend" },
]

export default function SortSelect({ sortBy }: { sortBy: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={sortBy}
      onChange={(e) => handleChange(e.target.value)}
      className="shrink-0 text-sm border border-ui-border-base rounded px-3 py-2 bg-white text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-blue-600"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
