"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function SearchBox() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q") ?? ""

  const submit = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("q", value)
    } else {
      params.delete("q")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit(((new FormData(e.currentTarget).get("q") as string) || "").trim())
      }}
      className="relative"
      role="search"
    >
      <input
        key={q}
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Produkte suchen…"
        aria-label="Produkte suchen"
        className="text-sm border border-white/30 rounded pl-3 pr-9 py-1.5 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 backdrop-blur-sm w-44 medium:w-56"
      />
      <button
        type="submit"
        aria-label="Suchen"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  )
}
