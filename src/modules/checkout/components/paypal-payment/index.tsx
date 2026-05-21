"use client"

import { placeOrder, initiatePaymentSession } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useState } from "react"
import ErrorMessage from "../error-message"

type PayPalPaymentProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
}

const PayPalPayment = ({ cart, notReady }: PayPalPaymentProps) => {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    return <Button disabled>PayPal nicht konfiguriert</Button>
  }

  if (notReady) {
    return <Button size="large" disabled>Bestellung aufgeben</Button>
  }

  const createOrder = async () => {
    try {
      const updated = await initiatePaymentSession(cart, {
        provider_id: "pp_paypal_paypal",
      })
      const session = updated?.payment_collection?.payment_sessions?.find(
        (s: any) => s.provider_id === "pp_paypal_paypal"
      )
      return (session?.data as any)?.id
    } catch (e: any) {
      setError(e.message)
      throw e
    }
  }

  const onApprove = async () => {
    setSubmitting(true)
    try {
      await placeOrder()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <PayPalScriptProvider
        options={{
          clientId,
          currency: cart.currency_code?.toUpperCase() || "EUR",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", label: "pay" }}
          disabled={submitting}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => setError(String(err))}
        />
      </PayPalScriptProvider>
      <ErrorMessage error={error} data-testid="paypal-payment-error" />
    </div>
  )
}

export default PayPalPayment
