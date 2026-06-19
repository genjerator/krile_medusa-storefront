"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { isPayPal, isManual, paymentInfoMap } from "@lib/constants"
import {
  initiatePaymentSession,
  placeOrder,
  retrieveCart,
  setShippingMethod,
} from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { Button, Heading, Text, Badge, clx } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import PayPalButtonsTwoStep from "@modules/checkout2/paypal-buttons"
import ErrorMessage from "@modules/checkout/components/error-message"
import RadioUI from "@modules/common/components/radio"
import CartTotals from "@modules/common/components/cart-totals"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import Divider from "@modules/common/components/divider"
import Addresses from "@modules/checkout/components/addresses"
import { convertToLocale } from "@lib/util/money"

export default function Checkout2Client({
  cart: initialCart,
  customer,
  shippingMethods: initialShipping,
  paymentMethods,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[]
  paymentMethods: { id: string; is_enabled: boolean }[]
}) {
  const t = useTranslations("checkout")
  const [cart, setCart] = useState(initialCart)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [selectedShipping, setSelectedShipping] = useState(
    initialShipping.length === 1 ? initialShipping[0].id : ""
  )
  const [shippingMethods, setShippingMethods] = useState(initialShipping)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [paypalLoading, setPaypalLoading] = useState(false)
  const [paypalApproved, setPaypalApproved] = useState(false)
  const [paypalAddress, setPaypalAddress] = useState<string | null>(null)
  // Live validity of the address form (reported by <Addresses>). Used so the
  // place-order button disables the moment a required field is cleared, before
  // the change is saved back to the cart.
  const [addressFormValid, setAddressFormValid] = useState(false)

  useEffect(() => {
    if (initialShipping.length === 1) {
      setShippingMethod({ cartId: cart.id, shippingMethodId: initialShipping[0].id }).catch(() => {})
    }
  }, [])

  // Keep local cart in sync with fresh server data (e.g. after the address
  // form is saved and the page revalidates).
  useEffect(() => {
    setCart(initialCart)
  }, [initialCart])

  // All required contact/address fields must be submitted (saved to the cart)
  // before the order can be placed. For PayPal these are filled from the
  // PayPal account on approval; for manual payment the buyer saves the form.
  const hasRequiredFields = !!(
    cart.email &&
    cart.shipping_address?.first_name &&
    cart.shipping_address?.last_name &&
    cart.shipping_address?.address_1 &&
    cart.shipping_address?.city &&
    cart.shipping_address?.postal_code &&
    cart.shipping_address?.country_code
  )

  // The address counts as ready only when it's saved on the cart AND the live
  // form is still valid. For PayPal the address comes from the PayPal account
  // (the form stays empty), so we don't require the form to be valid there.
  const addressReady =
    hasRequiredFields && (isPayPal(selectedPayment) || addressFormValid)

  const canPlaceOrder =
    selectedPayment &&
    selectedShipping &&
    addressReady &&
    (!isPayPal(selectedPayment) || paypalApproved)

  // What's still missing — shown under the (disabled) place-order button so the
  // buyer knows exactly why they can't continue yet.
  const missingRequirements: string[] = []
  if (!addressReady) missingRequirements.push(t("missingRequiredFields"))
  if (!selectedShipping) missingRequirements.push(t("missingShipping"))
  if (!selectedPayment) missingRequirements.push(t("missingPayment"))
  else if (isPayPal(selectedPayment) && !paypalApproved)
    missingRequirements.push(t("missingPaypalApproval"))

  // ── Payment selection ─────────────────────────────────────────────────────
  // For PayPal we create the Medusa payment session up front so the adapter has
  // a session to attach its order to.
  const handlePaymentSelect = async (method: string) => {
    setError(null)
    setSelectedPayment(method)
    setPaypalApproved(false)
    setPaypalAddress(null)
    if (!isPayPal(method)) return
    setPaypalLoading(true)
    try {
      await initiatePaymentSession(cart, { provider_id: method })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setPaypalLoading(false)
    }
  }

  // ── PayPal approval (authorize / hold) ────────────────────────────────────
  // Our PayPalButtonsTwoStep has already captured/authorized the PayPal order
  // and synced the buyer's address onto the cart — WITHOUT placing the order.
  // Here we just pull the fresh cart (now carrying the PayPal address) and flag
  // it as approved. The order is created only on the explicit "Jetzt kaufen"
  // click (two-step flow).
  const handlePayPalSuccess = async () => {
    setLoading(true)
    try {
      const refreshed = await retrieveCart(
        cart.id,
        "*items, *region, +items.total, *promotions, +shipping_methods.name, *shipping_address, *billing_address, +email"
      )
      if (refreshed) {
        setCart(refreshed)
        const sa = refreshed.shipping_address
        if (sa) {
          setPaypalAddress(
            `${sa.first_name ?? ""} ${sa.last_name ?? ""}, ${sa.address_1 ?? ""}, ${sa.postal_code ?? ""} ${sa.city ?? ""}`
          )
        }
      }
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
      console.error("[Jetzt kaufen] error:", e?.message, e?.digest, e)
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="content-container grid grid-cols-1 small:grid-cols-[1fr_380px] gap-x-10 py-12">

      {/* ── Left: Address + Versandmethode ───────────────────────────────── */}
      <div className="flex flex-col gap-y-6">
        <Addresses
          cart={cart}
          customer={customer}
          alwaysOpen
          onValidityChange={setAddressFormValid}
        />
        {isPayPal(selectedPayment) && paypalApproved && paypalAddress && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <Text className="txt-small font-medium text-green-700 mb-1">{t("paypalTaken")}</Text>
            <Text className="txt-small text-green-600">{paypalAddress}</Text>
          </div>
        )}

        {/* Versandmethode */}
        <div className="bg-white border border-ui-border-base rounded-lg p-5">
          <Heading level="h2" className="text-xl-semi mb-4">{t("shippingMethod")}</Heading>
          {shippingMethods.length === 0 ? (
            <Text className="txt-small text-ui-fg-muted">{t("noShippingOptions")}</Text>
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
          <Heading level="h2" className="text-xl-semi mb-4">{t("orderSummary")}</Heading>
          <CartTotals totals={cart} />
          <Divider className="my-4" />
          <ItemsPreviewTemplate cart={cart} />
        </div>

        {/* Payment method */}
        <div className="bg-white border border-ui-border-base rounded-lg p-5">
          <Heading level="h2" className="text-xl-semi mb-4">{t("paymentMethod")}</Heading>
          <div className="flex flex-col gap-2">
            {paymentMethods
              .filter(m => isManual(m.id) || isPayPal(m.id))
              .map((m) => (
                <div
                  key={m.id}
                  onClick={() => handlePaymentSelect(m.id)}
                  className={clx(
                    "flex items-center gap-x-3 py-3 px-4 border rounded-lg cursor-pointer transition-colors",
                    selectedPayment === m.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-ui-border-base hover:border-ui-border-strong"
                  )}
                >
                  <RadioUI checked={selectedPayment === m.id} />
                  <span className="txt-compact-small font-medium">
                    {paymentInfoMap[m.id]?.title || (isPayPal(m.id) ? "PayPal" : t("prepayment"))}
                  </span>
                </div>
              ))}
          </div>

          {/* Require a shipping method BEFORE paying: PayPal authorizes funds on
              approval, so paying first would leave the order unplaceable. */}
          {isPayPal(selectedPayment) && !selectedShipping && !paypalApproved && (
            <div className="mt-4">
              <Text className="txt-small text-ui-fg-muted">
                {t("selectShippingBeforePaypal")}
              </Text>
            </div>
          )}

          {/* PayPal UI (Smart Buttons / Card) — shown once PayPal is selected
              AND shipping is chosen, until the buyer has approved. */}
          {isPayPal(selectedPayment) && selectedShipping && !paypalApproved && (
            <div className="mt-4">
              {paypalLoading ? (
                <Text className="txt-small text-ui-fg-muted">{t("loading")}</Text>
              ) : (
                <PayPalButtonsTwoStep
                  cartId={cart.id}
                  selectedProviderId={selectedPayment}
                  baseUrl={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!}
                  publishableApiKey={process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
                  onApproved={() => handlePayPalSuccess()}
                  onError={(message) => setError(message)}
                />
              )}
            </div>
          )}

          {paypalApproved && (
            <div className="mt-3 flex items-center gap-2">
              <Badge color="green" size="2xsmall">{t("paypalConfirmed")}</Badge>
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
          {t("buyNow")}
        </Button>
        {!canPlaceOrder && missingRequirements.length > 0 && (
          <Text className="txt-small text-amber-600 text-center">
            {t("stillNeeded")}: {missingRequirements.join(" · ")}
          </Text>
        )}
        <Text className="txt-small text-ui-fg-muted text-center">
          {t("termsHint")}
        </Text>

      </div>
    </div>
  )
}
