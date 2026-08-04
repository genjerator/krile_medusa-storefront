import { marked } from "marked"

/**
 * Product descriptions may be stored either as HTML (admin WYSIWYG) or as
 * plain Markdown. Detect which one it is and always return HTML.
 */
export function descriptionToHtml(description: string): string {
  const looksLikeHtml = /<\/?[a-z][^>]*>/i.test(description)
  if (looksLikeHtml) {
    return description
  }
  return marked.parse(description, { async: false }) as string
}

const META_DESCRIPTION_MAX_LENGTH = 160

/**
 * Product/category descriptions are rich HTML or Markdown, but meta/OG
 * description tags must be short plain text. Strips HTML tags and Markdown
 * markers (bold, headings, lists, quotes), collapses whitespace, and truncates
 * at a word boundary so search engines don't render raw markup or cut mid-word.
 */
export function toMetaDescription(
  description: string | null | undefined
): string {
  if (!description) return ""
  const plain = description
    .replace(/<[^>]*>/g, " ") // HTML tags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ") // other entities
    .replace(/\*\*|__/g, " ") // markdown bold
    .replace(/(^|\s)[*_>#-]+(\s|$)/g, " ") // markdown markers at token edges
    .replace(/[`*_]/g, "") // stray inline markers
    .replace(/\s+/g, " ")
    .trim()

  if (plain.length <= META_DESCRIPTION_MAX_LENGTH) return plain
  return plain.slice(0, META_DESCRIPTION_MAX_LENGTH).replace(/\s+\S*$/, "") + "…"
}
