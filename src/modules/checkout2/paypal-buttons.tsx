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
 * PayPal buttons for checkout2 — "pay in popup" flow.
 *
 * The SDK is loaded with `commit: true`, so the popup's final button reads
 * "Jetzt bezahlen" / "Complete Purchase" and shows the FINAL amount (no
 * "up to X / additional fees / final amount when you return" disclaimer).
 *
 * On approval we CAPTURE (charge) the order in the popup, then fill the buyer's
 * address onto the cart FROM PayPal — but only the fields they didn't already
 * enter on-site (`setPayPalAddress` never overwrites existing cart data). Then
 * we hand the order id back; "Jetzt kaufen" afterwards only places the order
 * (`placeOrder()`) — the money is already captured.
 */

type Props = {
  cartId: string
  selectedProviderId: string
  baseUrl: string
  publishableApiKey?: string
  onApproved: (paypalOrderId: string) => void | Promise<void>
  onError: (message: string) => void
}

/** PayPal capture payloads put the buyer details in a few different places
 * depending on funding source — read them all with fallbacks. */
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
      // `commit: true` → the popup's final button reads "Jetzt bezahlen" /
      // "Complete Purchase" and shows the FINAL amount (no "up to X / additional
      // fees / final amount when you return" disclaimer). We capture the payment
      // in `onApprove` (in the popup); "Jetzt kaufen" then only places the order.
      commit: true,
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
        onApprove={async (data: { orderID?: string }) => {
          try {
            // `commit: true` → capture (charge) the payment now, in the popup.
            // This attaches the capture to the cart's payment session so the
            // later "Jetzt kaufen" only needs to place the order.
            const res: any = await api.captureOrder(cartId, String(data?.orderID || ""))
            // Fill the address from PayPal ONLY where the buyer left it empty
            // on-site — setPayPalAddress never overwrites existing cart data.
            const payload = res?.capture || res?.authorization || res
            await setPayPalAddress(extractPayPalAddress(payload))
            await onApproved(String(data?.orderID || ""))
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
