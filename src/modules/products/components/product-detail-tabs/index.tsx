"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { HttpTypes } from "@medusajs/types"

const tabs = ["Beschreibung", "Technische Daten"]

export default function ProductDetailTabs({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const [active, setActive] = useState(0)
  const t = useTranslations("technicalData")
  const metadata = (product as any).metadata ?? {}

  const formatValue = (v: unknown): string => {
    if (v === true) return "●"
    if (v === false) return "–"
    if (v === "optional") return t("values.optional")
    return String(v)
  }

  // Group metadata by section prefix (e.g. "ausstattung__field")
  const sections: Record<string, { field: string; label: string; value: string }[]> = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (!key.includes("__")) continue
    const [section, field] = key.split("__")
    if (!sections[section]) sections[section] = []
    let label: string
    try { label = t(`fields.${field}`) } catch { label = field }
    sections[section].push({ field, label, value: formatValue(value) })
  }

  return (
    <div className="border border-ui-border-base rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-ui-border-base bg-white overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              active === i
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-ui-fg-muted hover:text-ui-fg-base"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <div>
          {active === 0 && (
            <p className="text-sm text-ui-fg-base leading-relaxed">
              {product.description ||
                `Die ${product.title} ist eine kompakte und leistungsstarke Vakuumverpackungsmaschine, die sich ideal für das Vakuumverpacken von Lebensmitteln und Non-Food-Produkten eignet. Dank ihrer benutzerfreundlichen Bedienung, der hochwertigen Verarbeitung aus Edelstahl und der präzisen Vakuumtechnologie garantiert sie optimale Verpackungsergebnisse und eine lange Lebensdauer.`}
            </p>
          )}
          {active === 1 && (
            <div className="space-y-6">
              {Object.keys(sections).length === 0 && (
                <p className="text-sm text-ui-fg-muted">Keine technischen Daten verfügbar.</p>
              )}
              {Object.entries(sections).map(([section, rows]) => (
                <div key={section}>
                  <h5 className="font-bold text-sm text-ui-fg-base mb-2 pb-1 border-b border-ui-border-base">
                    {(() => { try { return t(`sections.${section}`) } catch { return section } })()}
                  </h5>
                  <table className="w-full text-sm">
                    <tbody>
                      {rows.map(({ field, label, value }) => (
                        <tr key={field} className="border-b border-ui-border-base last:border-0">
                          <td className="py-2 pr-4 text-ui-fg-muted w-64">{label}</td>
                          <td className="py-2 text-ui-fg-base">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {active === 2 && <p className="text-sm text-ui-fg-muted">Keine Downloads verfügbar.</p>}
          {active === 3 && <p className="text-sm text-ui-fg-muted">Kein Zubehör verfügbar.</p>}
          {active === 4 && <p className="text-sm text-ui-fg-muted">Für Service & Support kontaktieren Sie uns bitte direkt.</p>}
        </div>

      </div>
    </div>
  )
}
