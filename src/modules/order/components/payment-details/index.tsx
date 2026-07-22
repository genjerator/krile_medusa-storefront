"use client"

import { Container, Heading, Text } from "@medusajs/ui"
import { CreditCard } from "@medusajs/icons"
import { useTranslations } from "next-intl"

import { isManual, isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const bankDetails = [
  { label: "Inhaber", value: "Planeta GmbH & Co.KG" },
  { label: "Institut", value: "Sparkasse Schwaben Bodensee" },
  { label: "BIC / SWIFT", value: "BYLADEM1MLM" },
  { label: "IBAN", value: "DE10 7315 0000 1002 0935 14" },
]

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const t = useTranslations("order")
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const paymentInfo = payment ? (paymentInfoMap[payment.provider_id] ?? { title: payment.provider_id, icon: <CreditCard /> }) : null

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {t("payment")}
      </Heading>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <Text
              className="txt-medium-plus text-ui-fg-base w-1/3"
              data-testid="payment-method"
            >
              {paymentInfo?.title}
            </Text>
            <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center w-2/3">
              <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                {paymentInfo?.icon}
              </Container>
              <Text data-testid="payment-amount">
                {isStripeLike(payment.provider_id) && payment.data?.card_last4
                  ? `**** **** **** ${payment.data.card_last4}`
                  : `${convertToLocale({
                      amount: payment.amount,
                      currency_code: order.currency_code,
                    })} ${t("paidAt")} ${new Date(
                      payment.created_at ?? ""
                    ).toLocaleString()}`}
              </Text>
            </div>
          </div>
        )}

        {payment && isManual(payment.provider_id) && (
          <div className="mt-6 flex flex-col gap-y-2" data-testid="bank-details">
            {bankDetails.map(({ label, value }) => (
              <div key={label} className="flex items-start gap-x-1 w-full">
                <Text className="txt-medium-plus text-ui-fg-base w-1/3">
                  {label}
                </Text>
                <Text className="txt-medium text-ui-fg-subtle w-2/3">
                  {value}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
