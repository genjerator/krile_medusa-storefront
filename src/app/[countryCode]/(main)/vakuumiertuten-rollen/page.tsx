import { Metadata } from "next"
import { getVacuumBagOptions } from "@lib/data/vacuum-bags"
import { listProducts } from "@lib/data/products"
import VacuumBagConfigurator from "@modules/vacuum-bags/components/configurator"

export const metadata: Metadata = {
  title: "Vakuumiertüten konfigurieren",
  description:
    "Vakuumiertüten nach Maß: Farbe, Stärke, Breite und Höhe wählen und direkt bestellen.",
}

const PRODUCT_HANDLE = "vakuumiertueten"

export default async function VakuumiertutenRollenPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

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
          Vakuumiertüten nach Maß
        </h1>
        <p className="text-sm text-ui-fg-subtle leading-relaxed">
          Stellen Sie Ihre Vakuumiertüten individuell zusammen: Wählen Sie Farbe,
          Stärke sowie Breite und Höhe. Der Preis wird sofort für die gewählte
          Kombination angezeigt. Verkauf erfolgt in Packungen.
        </p>
      </div>

      {options && options.combinations.length > 0 ? (
        <VacuumBagConfigurator
          options={options}
          countryCode={countryCode}
          baseImage={baseImage}
        />
      ) : (
        <p className="text-sm text-ui-fg-subtle">
          Der Konfigurator ist derzeit nicht verfügbar. Bitte kontaktieren Sie uns
          für ein Angebot.
        </p>
      )}
    </div>
  )
}
