import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const SUPPORTED_LOCALES = ["de", "en", "it", "fr", "ru"] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const MEDUSA_LOCALE_TO_LANG: Record<string, SupportedLocale> = {
  "de-DE": "de",
  "en-US": "en",
  "it-IT": "it",
  "fr-FR": "fr",
  "ru-RU": "ru",
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const medusaLocale = cookieStore.get("_medusa_locale")?.value
  const langCookie = cookieStore.get("_lang")?.value as SupportedLocale | undefined

  const locale: SupportedLocale =
    langCookie && SUPPORTED_LOCALES.includes(langCookie as SupportedLocale)
      ? langCookie
      : (medusaLocale && MEDUSA_LOCALE_TO_LANG[medusaLocale]) || "de"

  const enMessages = (await import("../../messages/en.json")).default
  const localeMessages = locale !== "en"
    ? (await import(`../../messages/${locale}.json`)).default
    : enMessages

  // Merge with EN as base so missing keys fall back to English
  const messages = Object.keys(enMessages).reduce<Record<string, Record<string, string>>>(
    (acc, ns) => {
      acc[ns] = { ...enMessages[ns], ...(localeMessages[ns] ?? {}) }
      return acc
    },
    {}
  )

  return {
    locale,
    messages,
    getMessageFallback({ key }) {
      return key
    },
  }
})
