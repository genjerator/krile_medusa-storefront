"use client"

import { useMemo } from "react"
import {
  PayPalScriptProvider,
  PayPalButtons,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js"
import { usePayPalConfig, createPayPalStoreApi } from "@easypayment/medusa-paypal-ui"
import { Text } from "@medusajs/ui"

/**
 * Two-step PayPal buttons for checkout2 — "confirm on Jetzt kaufen" flow.
 *
 * The SDK is loaded with `commit: true` so PayPal shows the FINAL amount (no
 * "up to X / additional fees / final amount when you return" disclaimer). NOTE:
 * `commit` only sets the popup button WORDING ("Jetzt bezahlen") — it does NOT
 * charge. Approving does NOT capture. On approval we ONLY hand the PayPal
 * order id back to the checkout form.
 *
 * The buttons are gated on a fully filled address form (see `disabled`), and
 * the typed address is the one that ships: the payer/shipping address from the
 * PayPal account is deliberately NOT written back to the cart.
 *
 * The money is captured — and the order placed — later, when the buyer clicks
 * "Jetzt kaufen" (→ checkout form calls `captureOrder` then `placeOrder()`).
 */

type Props = {
  cartId: string
  selectedProviderId: string
  baseUrl: string
  publishableApiKey?: string
  /** Grey out the buttons and block the popup (e.g. while the address form is
   * incomplete). */
  disabled?: boolean
  onApproved: (paypalOrderId: string) => void | Promise<void>
  onError: (message: string) => void
}

export default function PayPalButtonsTwoStep({
  cartId,
  selectedProviderId,
  baseUrl,
  publishableApiKey,
  disabled = false,
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
    const disabledFunding = Array.isArray(config.disable_buttons)
      ? config.disable_buttons.filter(Boolean)
      : []
    if (disabledFunding.length) opts["disable-funding"] = disabledFunding.join(",")
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
        disabled={disabled}
        // Safety net alongside `disabled`: even if a click gets through (e.g.
        // a stale render), refuse to open the popup while blocked.
        onClick={(_data: unknown, actions: { resolve: () => void; reject: () => void }) =>
          disabled ? actions.reject() : actions.resolve()
        }
        createOrder={async () => {
          const r = await api.createOrder(cartId)
          return r.id
        }}
        onApprove={async (data: { orderID?: string }) => {
          try {
            const orderId = String(data?.orderID || "")
            // Do NOT capture here — `commit: true` only changes the popup button
            // wording; it does NOT charge. The buyer has only *approved*, not
            // paid. The cart keeps the address the buyer typed into the form
            // (required before the buttons unlock) — the PayPal account address
            // is NOT written back. The capture happens later, on the explicit
            // "Jetzt kaufen" click.
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
