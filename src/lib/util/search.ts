import { HttpTypes } from "@medusajs/types"

/**
 * Folds a string for diacritic-insensitive search: "Bügel", "bugel" and
 * "buegel" all normalize to "bugel" (ß → ss, ä/ö/ü → a/o/u, ae/oe/ue → a/o/u).
 */
export const normalizeSearch = (value: string): string =>
  value
    .toLowerCase()
    .replace(/ß/g, "ss") // ß
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining marks (ü → u, ä → a, …)
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")

/**
 * True when every word of the query occurs in the product's title or
 * description, compared accent-insensitively.
 */
export const productMatchesSearch = (
  product: HttpTypes.StoreProduct,
  q: string
): boolean => {
  const haystack = normalizeSearch(
    [product.title, product.description].filter(Boolean).join(" ")
  )

  return normalizeSearch(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}
