import { HttpTypes } from "@medusajs/types"
import { NextRequest } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const DEFAULT_REGION = "de"

// Maps URL prefixes to Medusa locale codes for the Translation Module
const LOCALE_MAP: Record<string, string> = {
  de: "de-DE",
  at: "de-DE",
  ch: "de-DE",
  en: "en-US",
  gb: "en-US",
  us: "en-US",
  it: "it-IT",
  fr: "fr-FR",
  ru: "ru-RU",
}

// Virtual language codes that are not real ISO country codes.
// Maps to a real country code used for region lookup.
const VIRTUAL_TO_COUNTRY: Record<string, string> = {
  en: "de",
  it: "de",
  fr: "de",
  ru: "de",
}

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

/**
 * Resolves the Medusa locale code for a given country/language code.
 * Falls back to the default region's locale.
 */
export function getLocale(countryCode: string): string {
  return LOCALE_MAP[countryCode] ?? LOCALE_MAP[DEFAULT_REGION]
}

/**
 * Fetches regions from Medusa and builds a map of country/language code → region.
 * Cached in memory for one hour and via the Next fetch cache.
 */
export async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()

    // Inject virtual language codes that aren't real ISO country codes
    for (const [langCode, countryCode] of Object.entries(VIRTUAL_TO_COUNTRY)) {
      const region = regionMapCache.regionMap.get(countryCode)
      if (region) {
        regionMapCache.regionMap.set(langCode, region)
      }
    }
  }

  return regionMapCache.regionMap
}

/**
 * Determines the country code for a request based on the URL prefix,
 * a geo-IP header, or the default region.
 */
export async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}
