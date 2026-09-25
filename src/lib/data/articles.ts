"use server"

import { sdk } from "@lib/config"

/** Localised article as returned by /store/articles (server resolves the locale). */
export type ArticleCard = {
  id: string
  slug: string
  title: string | null
  excerpt: string | null
  cover_image: string | null
  category: string | null
  published_at: string | null
  author: ArticleAuthor | null
}

export type ArticleFull = ArticleCard & {
  status: "draft" | "published" | null
  body: string | null
  meta_title: string | null
  meta_description: string | null
}

export type ArticleAuthor = {
  id: string
  name: string
  slug: string
  role: string | null
  photo_url: string | null
  linkedin_url: string | null
  website_url: string | null
  xing_url: string | null
  bio: string | null
}

const REVALIDATE = 300 // ISR: refresh published content every 5 min

/** List published articles for the magazine index (newest first). */
export const listArticles = async (
  locale: string,
  opts: { limit?: number; offset?: number } = {}
): Promise<{ articles: ArticleCard[]; count: number }> => {
  const limit = opts.limit ?? 12
  const offset = opts.offset ?? 0
  return sdk.client
    .fetch<{ articles: ArticleCard[]; count: number }>(
      `/store/articles?lang=${locale}&limit=${limit}&offset=${offset}`,
      { method: "GET", next: { revalidate: REVALIDATE, tags: ["articles"] } }
    )
    .catch(() => ({ articles: [], count: 0 }))
}

/**
 * A single article by slug (or null). With `preview`, drafts and not-yet-
 * published articles are returned too (via `?krile=true` on the storefront) —
 * fetched uncached so edits show immediately.
 */
export const getArticle = async (
  locale: string,
  slug: string,
  opts: { preview?: boolean } = {}
): Promise<ArticleFull | null> => {
  const preview = opts.preview ?? false
  const url = `/store/articles/${encodeURIComponent(slug)}?lang=${locale}${
    preview ? "&preview=true" : ""
  }`
  return sdk.client
    .fetch<{ article: ArticleFull | null }>(url, {
      method: "GET",
      ...(preview
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE, tags: ["articles", `article-${slug}`] } }),
    })
    .then((r) => {
      console.log(`[getArticle] ${url} -> ${r?.article ? "FOUND" : "NULL body"}`)
      return r.article
    })
    .catch((e) => {
      console.error(`[getArticle] ${url} -> FAILED: ${e?.message ?? e}`)
      return null
    })
}

/** Published Magazin articles an admin linked to a product (newest first). */
export const getRelatedArticles = async (
  locale: string,
  productId: string
): Promise<ArticleCard[]> => {
  return sdk.client
    .fetch<{ articles: ArticleCard[] }>(
      `/store/products/${encodeURIComponent(productId)}/related-articles?lang=${locale}`,
      { method: "GET", next: { revalidate: REVALIDATE, tags: ["articles", `product-articles-${productId}`] } }
    )
    .then((r) => r.articles ?? [])
    .catch(() => [])
}

/** An author + their published articles (or null). */
export const getArticleAuthor = async (
  locale: string,
  slug: string
): Promise<{ author: ArticleAuthor; articles: ArticleCard[] } | null> => {
  return sdk.client
    .fetch<{ author: ArticleAuthor | null; articles: ArticleCard[] }>(
      `/store/article-authors/${encodeURIComponent(slug)}?lang=${locale}`,
      { method: "GET", next: { revalidate: REVALIDATE, tags: ["articles"] } }
    )
    .then((r) => (r.author ? { author: r.author, articles: r.articles } : null))
    .catch(() => null)
}

/** All published article slugs (paginated) — for the sitemap. */
export const listAllArticleSlugs = async (): Promise<
  { slug: string; published_at: string | null }[]
> => {
  const out: { slug: string; published_at: string | null }[] = []
  let offset = 0
  for (let i = 0; i < 200; i++) {
    const { articles, count } = await listArticles("de", { limit: 100, offset })
    for (const a of articles) out.push({ slug: a.slug, published_at: a.published_at })
    offset += 100
    if (offset >= count || articles.length === 0) break
  }
  return out
}
