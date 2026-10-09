import { getTranslations } from "next-intl/server"
import { getVacuumBagOptions } from "@lib/data/vacuum-bags"
import { listProducts } from "@lib/data/products"
import VacuumBagConfigurator from "@modules/vacuum-bags/components/configurator"

// The single configurable product that backs the matrix (same as the standalone
// /vakuumiertuten-rollen page).
const PRODUCT_HANDLE = "vakuumiertueten"

/**
 * Renders the vacuum-bag configurator as the main content of the
 * `vakuumiertuten-rollen` category page — shown instead of the product grid.
 * Server component: fetches the price matrix + base image like the standalone
 * /vakuumiertuten-rollen page. The category banner already shows the heading, so
 * only the intro + configurator are rendered here (no duplicate <h1>).
 */
export default async function VakuumiertutenConfiguratorSection({
  countryCode,
}: {
  countryCode: string
}) {
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
    <div className="py-4">
      <p className="text-sm text-ui-fg-subtle leading-relaxed max-w-3xl mb-8">
        {t("intro")}
      </p>
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
