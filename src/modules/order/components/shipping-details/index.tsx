import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getTranslations } from "next-intl/server"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = async ({ order }: ShippingDetailsProps) => {
  const t = await getTranslations("order")

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {t("delivery")}
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {t("shippingAddress")}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col w-1/3 "
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">{t("contact")}</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">{t("method")}</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>

      {(() => {
        const s = order.shipping_address
        const b = order.billing_address
        const isSame =
          !b ||
          (b.address_1 === s?.address_1 &&
            b.postal_code === s?.postal_code &&
            b.city === s?.city &&
            b.country_code === s?.country_code &&
            b.first_name === s?.first_name &&
            b.last_name === s?.last_name)
        if (isSame) return null
        return (
          <div className="flex items-start gap-x-8 mt-6">
            <div className="flex flex-col w-1/3" data-testid="billing-address-summary">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t("billingAddress")}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {b?.first_name} {b?.last_name}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {b?.address_1} {b?.address_2}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {b?.postal_code}, {b?.city}
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                {b?.country_code?.toUpperCase()}
              </Text>
            </div>
          </div>
        )
      })()}

      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
