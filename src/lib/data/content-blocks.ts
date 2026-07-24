"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type ContentBlock = {
  key: string
  title: string | null
  /** Rich-text HTML resolved for the requested locale (falls back to German). */
  body: string
}

/**
 * Fetches a single published content block by its key, resolved for `locale`
 * (de/en/it). Returns null if the block doesn't exist or isn't published, so
 * callers can render nothing gracefully. Backed by the admin "Content Blocks"
 * editor via GET /store/content-blocks/:key.
 */
export const getContentBlock = async (
  key: string,
  locale: string = "de"
): Promise<ContentBlock | null> => {
  const next = {
    ...(await getCacheOptions("content-blocks")),
  }

  return sdk.client
    .fetch<{ content_block: ContentBlock | null }>(
      `/store/content-blocks/${key}`,
      {
        query: { locale },
        next,
        cache: "force-cache",
      }
    )
    .then(({ content_block }) => content_block)
    .catch(() => null)
}
