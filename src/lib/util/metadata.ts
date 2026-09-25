import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"

export const SITE_NAME = "Planeta Industries"
export const DEFAULT_OG_IMAGE = "/og-image.jpg"

const META_DESCRIPTION_MAX_LENGTH = 160

/**
 * Meta/OG/Twitter descriptions must be plain text: strip HTML, collapse
 * whitespace, and truncate on a word boundary so search engines don't cut it
 * off mid-word.
 */
export function toPlainMetaDescription(value: string): string {
  const plain = value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (plain.length <= META_DESCRIPTION_MAX_LENGTH) {
    return plain
  }
  return plain.slice(0, META_DESCRIPTION_MAX_LENGTH).replace(/\s+\S*$/, "") + "…"
}

// Locales with real translations / shown in the language switcher.
const LOCALES = ["de", "en", "it"] as const
const OG_LOCALE: Record<string, string> = {
  de: "de_DE",
  en: "en_US",
  it: "it_IT",
}

/**
 * Builds a consistent set of page metadata: title, description, Open Graph,
 * Twitter card, canonical, and hreflang alternates for the de/en/it language
 * versions.
 *
 * `path` must be locale-agnostic (no `/[countryCode]` prefix) — e.g. `/magazin`.
 * Pass `locale` (the route's countryCode) on dynamic pages so the canonical
 * points at the current language; static pages default the canonical to German.
 */
export function buildMetadata({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  path,
  locale,
}: {
  title: string
  description: string
  image?: string
  path?: string
  locale?: string
}): Metadata {
  const ogTitle = `${title} | ${SITE_NAME}`
  description = toPlainMetaDescription(description)
  const canonicalLocale =
    locale && (LOCALES as readonly string[]).includes(locale) ? locale : "de"

  let alternates: Metadata["alternates"] | undefined
  let ogUrl: string | undefined

  if (path !== undefined) {
    const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`
    const localePath = (l: string) => `/${l}${clean}`

    alternates = {
      canonical: localePath(canonicalLocale),
      languages: {
        "x-default": localePath("de"),
        ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l)])),
      },
    }
    ogUrl = `${getBaseURL()}${localePath(canonicalLocale)}`
  }

  return {
    title,
    description,
    ...(alternates ? { alternates } : {}),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[canonicalLocale],
      alternateLocale: LOCALES.filter((l) => l !== canonicalLocale).map(
        (l) => OG_LOCALE[l]
      ),
      title: ogTitle,
      description,
      ...(ogUrl ? { url: ogUrl } : {}),
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  }
}
