"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

// Virtual language codes → real ISO country code fallback for region lookup
const LANGUAGE_COUNTRY_FALLBACK: Record<string, string> = {
  en: "de",
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    const resolvedCode = LANGUAGE_COUNTRY_FALLBACK[countryCode] ?? countryCode

    if (regionMap.has(resolvedCode)) {
      return regionMap.get(resolvedCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = resolvedCode
      ? regionMap.get(resolvedCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}
