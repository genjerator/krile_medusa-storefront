"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { isPayPal, isManual, paymentInfoMap } from "@lib/constants"
import {
  initiatePaymentSession,
  placeOrder,
  updateCart,
  setShippingMethod,
} from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { Button, Heading, Text, Badge, clx } from "@medusajs/ui"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import ErrorMessage from "@modules/checkout/components/error-message"
import RadioUI from "@modules/common/components/radio"
import CartTotals from "@modules/common/components/cart-totals"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import Divider from "@modules/common/components/divider"
import Addresses from "@modules/checkout/components/addresses"
import { convertToLocale } from "@lib/util/money"

export default function Checkout2Client({
  cart,
  customer,
  shippingMethods: initialShipping,
  paymentMethods,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[]
  paymentMethods: { id: string; is_enabled: boolean }[]
}) {
  const [selectedPayment, setSelectedPayment] = useState("")
  const [selectedShipping, setSelectedShipping] = useState(
    initialShipping.length === 1 ? initialShipping[0].id : ""
  )
  const [shippingMethods, setShippingMethods] = useState(initialShipping)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [paypalApproved, setPaypalApproved] = useState(false)
  const [paypalAddress, setPaypalAddress] = useState<string | null>(null)

  useEffect(() => {
    if (initialShipping.length === 1) {
      setShippingMethod({ cartId: cart.id, shippingMethodId: initialShipping[0].id }).catch(() => {})
    }
  }, [])

  const canPlaceOrder =
    selectedPayment &&
    selectedShipping &&
    (isPayPal(selectedPayment) ? paypalApproved : cart.shipping_address?.address_1)

  // ── PayPal flow ───────────────────────────────────────────────────────────
  const createPayPalOrder = async () => {
    const session = await initiatePaymentSession(cart, { provider_id: "pp_paypal_paypal" })
    const ps = session?.payment_collection?.payment_sessions?.find(
      (s: any) => s.provider_id === "pp_paypal_paypal"
    )
    return (ps?.data as any)?.id
  }

  const handlePayPalApprove = async (data: any, actions: any) => {
    setLoading(true)
    try {
      const details = await actions.order.get()
      const pu = details.purchase_units?.[0]?.shipping?.address
      if (pu) {
        await updateCart({
          shipping_address: {
            first_name: details.payer?.name?.given_name || "",
            last_name: details.payer?.name?.surname || "",
            address_1: pu.address_line_1 || "",
            address_2: pu.address_line_2 || "",
            city: pu.admin_area_2 || "",
            province: pu.admin_area_1 || "",
            postal_code: pu.postal_code || "",
            country_code: pu.country_code?.toLowerCase() || "de",
            phone: "",
          },
          billing_address: {
            first_name: details.payer?.name?.given_name || "",
            last_name: details.payer?.name?.surname || "",
            address_1: pu.address_line_1 || "",
            city: pu.admin_area_2 || "",
            postal_code: pu.postal_code || "",
            country_code: pu.country_code?.toLowerCase() || "de",
            phone: "",
          },
          email: details.payer?.email_address || cart.email || "",
        })
        setPaypalAddress(
          `${details.payer?.name?.given_name} ${details.payer?.name?.surname}, ${pu.address_line_1}, ${pu.postal_code} ${pu.admin_area_2}`
        )
      }
      // Refresh shipping methods with new address country
      const updated = await listCartShippingMethods(cart.id)
      if (updated?.length) setShippingMethods(updated)
      setPaypalApproved(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Shipping selection ────────────────────────────────────────────────────
  const handleShippingSelect = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      setSelectedShipping(id)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setLoading(true)
    setError(null)
    try {
      if (isManual(selectedPayment)) {
        await initiatePaymentSession(cart, { provider_id: selectedPayment })
      }
      await placeOrder()
    } catch (e: any) {
      if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="content-container grid grid-cols-1 small:grid-cols-[1fr_380px] gap-x-10 py-12">

      {/* ── Left: Address + Versandmethode ───────────────────────────────── */}
      <div className="flex flex-col gap-y-6">
        <Addresses cart={cart} customer={customer} />
        {isPayPal(selectedPayment) && paypalApproved && paypalAddress && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <Text className="txt-small font-medium text-green-700 mb-1">✓ Von PayPal übernommen:</Text>
            <Text className="txt-small text-green-600">{paypalAddress}</Text>
          </div>
        )}

        {/* Versandmethode */}
        <div className="bg-white border border-ui-border-base rounded-lg p-5">
          <Heading level="h2" className="text-xl-semi mb-4">Versandmethode</Heading>
          {shippingMethods.length === 0 ? (
            <Text className="txt-small text-ui-fg-muted">Keine Versandoptionen verfügbar.</Text>
          ) : (
            <div className="flex flex-col gap-2">
              {shippingMethods.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleShippingSelect(option.id)}
                  className={clx(
                    "flex items-center justify-between py-3 px-4 border rounded-lg cursor-pointer transition-colors",
                    selectedShipping === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-ui-border-base hover:border-ui-border-strong"
                  )}
                >
                  <div className="flex items-center gap-x-3">
                    <RadioUI checked={selectedShipping === option.id} />
                    <span className="txt-compact-small font-medium">{option.name}</span>
                  </div>
                  <span className="txt-compact-small text-ui-fg-subtle">
                    {convertToLocale({ amount: option.amount!, currency_code: cart.currency_code })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Summary + Payment + Delivery ───────────────────────────── */}
      <div className="sticky top-4 flex flex-col gap-y-6">

        {/* Order summary — top */}
        <div className="bg-white border border-ui-border-base rounded-lg p-5">
          <Heading level="h2" className="text-xl-semi mb-4">Bestellübersicht</Heading>
          <CartTotals totals={cart} />
          <Divider className="my-4" />
          <ItemsPreviewTemplate cart={cart} />
        </div>

        {/* Payment method */}
        <div className="bg-white border border-ui-border-base rounded-lg p-5">
          <Heading level="h2" className="text-xl-semi mb-4">Zahlungsmethode</Heading>
          <div className="flex flex-col gap-2">
            {paymentMethods
              .filter(m => isManual(m.id) || isPayPal(m.id))
              .map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedPayment(m.id)}
                  className={clx(
                    "flex items-center gap-x-3 py-3 px-4 border rounded-lg cursor-pointer transition-colors",
                    selectedPayment === m.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-ui-border-base hover:border-ui-border-strong"
                  )}
                >
                  <RadioUI checked={selectedPayment === m.id} />
                  <span className="txt-compact-small font-medium">
                    {paymentInfoMap[m.id]?.title || (isPayPal(m.id) ? "PayPal" : "Vorkasse")}
                  </span>
                </div>
              ))}
          </div>

          {/* PayPal button — shown when PayPal is selected */}
          {isPayPal(selectedPayment) && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && !paypalApproved && (
            <div className="mt-4">
              <PayPalScriptProvider options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: cart.currency_code?.toUpperCase() || "EUR",
                intent: "capture",
              }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", label: "pay" }}
                  createOrder={createPayPalOrder}
                  onApprove={handlePayPalApprove}
                  onError={(e) => setError(String(e))}
                />
              </PayPalScriptProvider>
            </div>
          )}

          {paypalApproved && (
            <div className="mt-3 flex items-center gap-2">
              <Badge color="green" size="2xsmall">✓ PayPal bestätigt</Badge>
            </div>
          )}
        </div>

        {/* Place order */}
        <ErrorMessage error={error} data-testid="checkout2-error" />
        <Button
          size="large"
          className="w-full"
          onClick={handlePlaceOrder}
          isLoading={loading}
          disabled={!canPlaceOrder || loading}
        >
          Jetzt kaufen
        </Button>
        <Text className="txt-small text-ui-fg-muted text-center">
          Mit Klick bestätigen Sie unsere AGB und Datenschutzerklärung.
        </Text>

      </div>
    </div>
  )
}
