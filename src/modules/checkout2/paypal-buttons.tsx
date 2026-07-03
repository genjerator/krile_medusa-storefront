"use client"

import { useMemo } from "react"
import {
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js"
import { usePayPalConfig, createPayPalStoreApi } from "@easypayment/medusa-paypal-ui"
import { Text } from "@medusajs/ui"
import { setPayPalAddress } from "@lib/data/cart"

/**
 * Two-step PayPal buttons for checkout2 — "review payment" flow.
 *
 * The SDK is loaded with `commit: false`, so the popup's final button reads
 * "Weiter"/"Continue" (not "Pay Now") and approving does NOT charge the buyer.
 * On approval we ONLY:
 *   1. read the payer/shipping address from the *approved* PayPal order (via
 *      the SDK's `actions.order.get()`, a read — no capture), and
 *   2. sync that address/name/email onto the cart, then hand the PayPal
 *      order id back to the checkout form.
 *
 * The money is captured — and the order placed — later, when the buyer clicks
 * "Jetzt kaufen" (→ checkout form calls `captureOrder` then `placeOrder()`).
 */

type Props = {
  cartId: string
  selectedProviderId: string
  baseUrl: string
  publishableApiKey?: string
  onApproved: (paypalOrderId: string) => void | Promise<void>
  onError: (message: string) => void
}

/** PayPal capture/authorize payloads put the buyer details in a few different
 * places depending on funding source — read them all with fallbacks. */
function extractPayPalAddress(payload: any) {
  const pu = payload?.purchase_units?.[0] ?? {}
  const shipping = pu?.shipping ?? {}
  const shipAddr = shipping?.address ?? {}
  const payer = payload?.payer ?? {}
  const ppSource = payload?.payment_source?.paypal ?? {}

  let first = payer?.name?.given_name || ppSource?.name?.given_name || ""
  let last = payer?.name?.surname || ppSource?.name?.surname || ""
  if (!first && !last && shipping?.name?.full_name) {
    const parts = String(shipping.name.full_name).trim().split(/\s+/)
    first = parts.shift() || ""
    last = parts.join(" ")
  }

  return {
    first_name: first,
    last_name: last,
    address_1: shipAddr?.address_line_1 || "",
    address_2: shipAddr?.address_line_2 || "",
    city: shipAddr?.admin_area_2 || "",
    province: shipAddr?.admin_area_1 || "",
    postal_code: shipAddr?.postal_code || "",
    country_code: String(
      shipAddr?.country_code || payer?.address?.country_code || ""
    ).toLowerCase(),
    email: payer?.email_address || ppSource?.email_address || "",
  }
}

export default function PayPalButtonsTwoStep({
  cartId,
  selectedProviderId,
  baseUrl,
  publishableApiKey,
  onApproved,
  onError,
}: Props) {
  const api = useMemo(
    () => createPayPalStoreApi({ baseUrl, publishableApiKey }),
    [baseUrl, publishableApiKey]
  )
  const { config, loading, error } = usePayPalConfig({
    baseUrl,
    publishableApiKey,
    cartId,
    enabled: true,
  })

  // Load the PayPal SDK ourselves with a buttons-only, memoised options object.
  // A new options reference on every render makes PayPalScriptProvider reload
  // the script (and briefly leaves `window.paypal.Buttons` undefined), so this
  // MUST be memoised. We deliberately request only `components: "buttons"` (no
  // card-fields / client-token) — this is a Smart-Buttons-only flow.
  const options = useMemo<ReactPayPalScriptOptions | null>(() => {
    if (!config) return null
    const opts: ReactPayPalScriptOptions = {
      clientId: config.client_id,
      currency: config.currency,
      intent: config.intent === "authorize" ? "authorize" : "capture",
      components: "buttons",
      // "Review payment" flow: `commit: false` makes the popup's final button
      // read "Weiter"/"Continue" (a review step follows) instead of "Pay Now",
      // and — together with not calling capture on approval — means the buyer
      // is not charged inside the popup.
      commit: false,
    }
    // Only set disable-funding when there's an actual value — passing
    // `undefined` serializes to `disable-funding=undefined` in the SDK URL,
    // which makes PayPal load without the Buttons component.
    const disabled = Array.isArray(config.disable_buttons)
      ? config.disable_buttons.filter(Boolean)
      : []
    if (disabled.length) opts["disable-funding"] = disabled.join(",")
    return opts
  }, [config])

  if (loading)
    return <Text className="txt-small text-ui-fg-muted">PayPal wird geladen…</Text>
  if (error) return <Text className="txt-small text-red-600">{error}</Text>
  if (!config || config.currency_supported === false || !options) return null

  return (
    <PayPalScriptProvider
      key={`${options.clientId}-${options.currency}-${options.intent}`}
      options={options}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: config.button_color,
          shape: config.button_shape,
          label: config.button_label,
          height: config.button_height,
        }}
        createOrder={async () => {
          const r = await api.createOrder(cartId)
          return r.id
        }}
        onApprove={async (data: { orderID?: string }, actions: any) => {
          try {
            const orderId = String(data?.orderID || "")
            // Do NOT capture here — with `commit: false` the buyer has only
            // *approved*, not paid. Read the approved order (no charge) to pull
            // the payer/shipping address and sync it onto the cart. The capture
            // happens later, on the explicit "Jetzt kaufen" click.
            let payload: any = null
            try {
              payload = await actions?.order?.get?.()
            } catch {
              payload = null
            }
            if (payload) {
              await setPayPalAddress(extractPayPalAddress(payload))
            }
            await onApproved(orderId)
          } catch (e: any) {
            onError(e?.message || "PayPal-Zahlung fehlgeschlagen")
          }
        }}
        onError={(e: any) =>
          onError(e?.message || "PayPal-Fehler")
        }
      />
    </PayPalScriptProvider>
  )
}
