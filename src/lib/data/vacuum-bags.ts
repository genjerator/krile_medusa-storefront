"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { getOrSetCart } from "./cart"

export type VacuumBagColor = {
  slug: string
  name: string
  hex: string | null
  image_url: string | null
  is_default: boolean
}

export type VacuumBagCombination = {
  color: string
  thickness_um: number
  width_mm: number
  height_mm: number
  price: number
  currency_code: string
}

export type VacuumBagOptions = {
  pack_size: number
  default_color: string | null
  colors: VacuumBagColor[]
  thicknesses: number[]
  widths: number[]
  heights: number[]
  combinations: VacuumBagCombination[]
}

/**
 * Dropdown data + the full active price matrix for the `/vakuumiertuten-rollen`
 * configurator. The whole matrix comes down as `combinations`, so the client can
 * cascade availability and show the live price without per-keystroke calls.
 */
export async function getVacuumBagOptions(): Promise<VacuumBagOptions | null> {
  const next = {
    ...(await getCacheOptions("vacuum-bags")),
  }

  return sdk.client
    .fetch<VacuumBagOptions>("/store/vacuum-bags/options", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .catch(() => null)
}

/**
 * Adds a configured vacuum bag to the cart. Ensures a cart exists, then hands the
 * chosen combination to the backend workflow, which validates it against the
 * matrix and lazily materialises the variant. `quantity` = number of packs.
 */
export async function addVacuumBagToCart({
  color,
  thickness_um,
  width_mm,
  height_mm,
  quantity,
  countryCode,
}: {
  color: string
  thickness_um: number
  width_mm: number
  height_mm: number
  quantity: number
  countryCode: string
}): Promise<{ success: boolean; message?: string }> {
  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    return { success: false, message: "Warenkorb konnte nicht erstellt werden." }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch("/store/vacuum-bags/add-to-cart", {
      method: "POST",
      body: {
        cart_id: cart.id,
        color,
        thickness_um,
        width_mm,
        height_mm,
        quantity,
      },
      headers,
    })

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)

    return { success: true }
  } catch (e: any) {
    const message =
      e?.message?.includes("nicht verfügbar")
        ? "Diese Kombination ist nicht verfügbar."
        : "Beim Hinzufügen zum Warenkorb ist ein Fehler aufgetreten."
    return { success: false, message }
  }
}
