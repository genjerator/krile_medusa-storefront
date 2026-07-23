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
