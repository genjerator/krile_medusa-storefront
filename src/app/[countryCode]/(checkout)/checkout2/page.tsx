import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import Checkout2Client from "@modules/checkout2/checkout-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = { title: "Checkout" }

export default async function Checkout2() {
  // Explicitly include address + email so the "Jetzt kaufen" gate can check
  // that all required fields are submitted.
  const cart = await retrieveCart(
    undefined,
    "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, *shipping_address, *billing_address, +email"
  )
  if (!cart) return notFound()

  const customer = await retrieveCustomer()
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  return (
    <Checkout2Client
      cart={cart}
      customer={customer}
      shippingMethods={shippingMethods ?? []}
      paymentMethods={paymentMethods ?? []}
    />
  )
}
