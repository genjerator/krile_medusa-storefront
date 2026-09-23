"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import {
  addVacuumBagToCart,
  type VacuumBagOptions,
} from "@lib/data/vacuum-bags"

type Selection = {
  color: string
  thickness_um: number
  width_mm: number
  height_mm: number
}

const selectClass =
  "border border-ui-border-base rounded-base px-4 py-2.5 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive w-full appearance-none"

// Map the site language to a BCP-47 tag for currency/number formatting.
const LOCALE_TAG: Record<string, string> = {
  de: "de-DE",
  en: "en-US",
  it: "it-IT",
  fr: "fr-FR",
  ru: "ru-RU",
}

export default function VacuumBagConfigurator({
  options,
  countryCode,
  baseImage,
}: {
  options: VacuumBagOptions
  countryCode: string
  baseImage?: string | null
}) {
  const { combinations, colors, pack_size } = options

  const t = useTranslations("vacuumConfigurator")
  const locale = useLocale()
  const money = (amount: number, currency_code: string) =>
    convertToLocale({ amount, currency_code, locale: LOCALE_TAG[locale] ?? "de-DE" })

  // ─── Cascading value helpers (color → thickness → width → height) ──────────
  const uniqSorted = (arr: number[]) => [...new Set(arr)].sort((a, b) => a - b)
  const thicknessesFor = (color: string) =>
    uniqSorted(combinations.filter((c) => c.color === color).map((c) => c.thickness_um))
  const widthsFor = (color: string, um: number) =>
    uniqSorted(
      combinations
        .filter((c) => c.color === color && c.thickness_um === um)
        .map((c) => c.width_mm)
    )
  const heightsFor = (color: string, um: number, w: number) =>
    uniqSorted(
      combinations
        .filter(
          (c) => c.color === color && c.thickness_um === um && c.width_mm === w
        )
        .map((c) => c.height_mm)
    )

  /** Clamp a desired selection to a fully-valid one (no dead-ends). */
  const normalize = (desired: Selection): Selection => {
    const color =
      colors.find((c) => c.slug === desired.color)?.slug ?? colors[0]?.slug ?? ""
    const ths = thicknessesFor(color)
    const thickness_um = ths.includes(desired.thickness_um) ? desired.thickness_um : ths[0]
    const ws = widthsFor(color, thickness_um)
    const width_mm = ws.includes(desired.width_mm) ? desired.width_mm : ws[0]
    const hs = heightsFor(color, thickness_um, width_mm)
    const height_mm = hs.includes(desired.height_mm) ? desired.height_mm : hs[0]
    return { color, thickness_um, width_mm, height_mm }
  }

  const initialColor =
    colors.find((c) => c.slug === options.default_color)?.slug ??
    colors.find((c) => c.is_default)?.slug ??
    colors[0]?.slug ??
    ""

  const [sel, setSel] = useState<Selection>(() =>
    normalize({
      color: initialColor,
      thickness_um: NaN,
      width_mm: NaN,
      height_mm: NaN,
    })
  )
  const [quantity, setQuantity] = useState(1)
  const [hoverColor, setHoverColor] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (patch: Partial<Selection>) => {
    setAdded(false)
    setError(null)
    setSel((prev) => normalize({ ...prev, ...patch }))
  }

  // Dropdown value lists for the current selection.
  const thicknessOptions = thicknessesFor(sel.color)
  const widthOptions = widthsFor(sel.color, sel.thickness_um)
  const heightOptions = heightsFor(sel.color, sel.thickness_um, sel.width_mm)

  // Exact price row for the (normalized → always valid) selection.
  const priceRow = useMemo(
    () =>
      combinations.find(
        (c) =>
          c.color === sel.color &&
          c.thickness_um === sel.thickness_um &&
          c.width_mm === sel.width_mm &&
          c.height_mm === sel.height_mm
      ),
    [combinations, sel]
  )

  const selectedColor = colors.find((c) => c.slug === sel.color)
  const previewColor = colors.find((c) => c.slug === hoverColor) ?? selectedColor
  const mainImage = previewColor?.image_url ?? baseImage ?? null

  const handleAdd = async () => {
    if (!priceRow) return
    setAdding(true)
    setError(null)
    const res = await addVacuumBagToCart({
      color: sel.color,
      thickness_um: sel.thickness_um,
      width_mm: sel.width_mm,
      height_mm: sel.height_mm,
      quantity,
      countryCode,
    })
    setAdding(false)
    if (res.success) {
      setAdded(true)
    } else {
      setError(res.message ?? t("addError"))
    }
  }

  const currency = priceRow?.currency_code ?? "eur"
  const unitPrice = priceRow?.price ?? 0
  const totalPrice = unitPrice * quantity

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      {/* Preview image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-ui-bg-subtle border border-ui-border-base flex items-center justify-center">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={t("imageAlt", { color: previewColor?.name ?? "" })}
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="object-contain p-6 transition-opacity duration-200"
          />
        ) : (
          <div
            className="w-2/3 h-2/3 rounded-lg border border-ui-border-base"
            style={{ backgroundColor: previewColor?.hex ?? "#e5e7eb" }}
            aria-hidden
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        {/* Farbe — swatches with hover preview */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ui-fg-base">
            {t("color")}: <span className="text-ui-fg-subtle">{selectedColor?.name}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const isSel = c.slug === sel.color
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => update({ color: c.slug })}
                  onMouseEnter={() => setHoverColor(c.slug)}
                  onMouseLeave={() => setHoverColor(null)}
                  title={c.name}
                  aria-label={c.name}
                  aria-pressed={isSel}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    isSel
                      ? "border-brand-navy ring-2 ring-brand-navy/30"
                      : "border-ui-border-base hover:border-ui-border-interactive"
                  }`}
                  style={{ backgroundColor: c.hex ?? "#e5e7eb" }}
                />
              )
            })}
          </div>
        </div>

        {/* Stärke / Breite / Höhe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ui-fg-base">{t("thickness")}</span>
            <select
              className={selectClass}
              value={sel.thickness_um}
              onChange={(e) => update({ thickness_um: Number(e.target.value) })}
            >
              {thicknessOptions.map((t) => (
                <option key={t} value={t}>
                  {t} µm
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ui-fg-base">{t("width")}</span>
            <select
              className={selectClass}
              value={sel.width_mm}
              onChange={(e) => update({ width_mm: Number(e.target.value) })}
            >
              {widthOptions.map((w) => (
                <option key={w} value={w}>
                  {w} mm
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ui-fg-base">{t("height")}</span>
            <select
              className={selectClass}
              value={sel.height_mm}
              onChange={(e) => update({ height_mm: Number(e.target.value) })}
            >
              {heightOptions.map((h) => (
                <option key={h} value={h}>
                  {h} mm
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Menge (packs) */}
        <label className="flex flex-col gap-1 max-w-[10rem]">
          <span className="text-sm font-medium text-ui-fg-base">
            {t("quantityLabel", { packSize: pack_size })}
          </span>
          <input
            type="number"
            min={1}
            max={1000}
            value={quantity}
            onChange={(e) => {
              setAdded(false)
              setQuantity(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))
            }}
            className={selectClass}
          />
        </label>

        {/* Price */}
        <div className="flex flex-col gap-0.5 border-t border-ui-border-base pt-4">
          {priceRow ? (
            <>
              <span className="text-2xl font-semibold text-ui-fg-base">
                {money(totalPrice, currency)}
              </span>
              <span className="text-sm text-ui-fg-subtle">
                {money(unitPrice, currency)} {t("perPack", { packSize: pack_size })}
                {quantity > 1 ? ` ${t("packsSuffix", { quantity })}` : ""}
              </span>
            </>
          ) : (
            <span className="text-sm text-ui-fg-subtle">
              {t("onRequest")}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!priceRow || adding}
          className="bg-brand-navy text-white rounded-base px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? t("adding") : t("addToCart")}
        </button>

        {added && (
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-ui-fg-base font-medium">
              {t("added")}
            </span>
            <LocalizedClientLink
              href="/cart"
              className="text-brand-navy font-medium hover:underline"
            >
              {t("goToCart")}
            </LocalizedClientLink>
          </div>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  )
}
