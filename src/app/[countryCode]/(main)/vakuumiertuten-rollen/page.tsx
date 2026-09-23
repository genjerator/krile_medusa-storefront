import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getVacuumBagOptions } from "@lib/data/vacuum-bags"
import { listProducts } from "@lib/data/products"
import VacuumBagConfigurator from "@modules/vacuum-bags/components/configurator"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("vacuumConfigurator")
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

const PRODUCT_HANDLE = "vakuumiertueten"

export default async function VakuumiertutenRollenPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const t = await getTranslations("vacuumConfigurator")

  const [options, productRes] = await Promise.all([
    getVacuumBagOptions(),
    listProducts({
      countryCode,
      queryParams: { handle: PRODUCT_HANDLE, limit: 1 } as any,
    }).catch(() => null),
  ])

  const baseImage = productRes?.response.products[0]?.thumbnail ?? null

  return (
    <div className="content-container py-16">
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl font-semibold text-ui-fg-base mb-4">
          {t("heading")}
        </h1>
        <p className="text-sm text-ui-fg-subtle leading-relaxed">
          {t("intro")}
        </p>
      </div>

      {options && options.combinations.length > 0 ? (
        <VacuumBagConfigurator
          options={options}
          countryCode={countryCode}
          baseImage={baseImage}
        />
      ) : (
        <p className="text-sm text-ui-fg-subtle">{t("unavailable")}</p>
      )}
    </div>
  )
}
