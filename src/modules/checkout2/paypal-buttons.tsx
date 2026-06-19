"use client"

import { useMemo } from "react"
import { PayPalButtons } from "@paypal/react-paypal-js"
import {
  PayPalProvider,
  usePayPalConfig,
  createPayPalStoreApi,
} from "@easypayment/medusa-paypal-ui"
import { Text } from "@medusajs/ui"
import { setPayPalAddress } from "@lib/data/cart"

/**
 * Two-step PayPal buttons for checkout2.
 *
 * Unlike the plugin's `MedusaNextPayPalAdapter`, this does NOT call
 * `markPaymentComplete` (`/store/paypal-complete` → completeCartWorkflow), so
 * approving in the PayPal popup does NOT place the order. Instead, on approval
 * we:
 *   1. capture/authorize the PayPal order (attaches it to the cart's payment
 *      session via the plugin's `/store/paypal/capture-order` route), and
 *   2. sync the PayPal payer address/name/email onto the cart.
 *
 * The order is only created later, when the buyer clicks "Jetzt kaufen"
 * (→ `placeOrder()` → cart completion).
 */

type Props = {
  cartId: string
  selectedProviderId: string
  baseUrl: string
  publishableApiKey?: string
  onApproved: () => void | Promise<void>
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

  if (loading)
    return <Text className="txt-small text-ui-fg-muted">PayPal wird geladen…</Text>
  if (error) return <Text className="txt-small text-red-600">{error}</Text>
  if (!config || config.currency_supported === false) return null

  const intent = config.intent === "authorize" ? "authorize" : "capture"
  const disableFunding = Array.isArray(config.disable_buttons)
    ? config.disable_buttons.join(",")
    : undefined

  return (
    <PayPalProvider
      config={config}
      intent={intent}
      disableFunding={disableFunding}
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
            const res: any = await api.captureOrder(
              cartId,
              String(data?.orderID || "")
            )
            // capture-order returns { capture } or { authorization }
            const payload = res?.capture || res?.authorization || res
            await setPayPalAddress(extractPayPalAddress(payload))
            await onApproved()
          } catch (e: any) {
            onError(e?.message || "PayPal-Zahlung fehlgeschlagen")
          }
        }}
        onError={(e: any) =>
          onError(e?.message || "PayPal-Fehler")
        }
      />
    </PayPalProvider>
  )
}
