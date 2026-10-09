"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale, useMessages } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import {
  addVacuumBagToCart,
  type VacuumBagOptions,
} from "@lib/data/vacuum-bags"

type Selection = {
  color: string
  type: string
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

const isTransparent = (slug?: string | null) => !slug || slug === "transparent"

const round2 = (n: number) => Math.round(n * 100) / 100

export default function VacuumBagConfigurator({
  options,
  countryCode,
  baseImage,
}: {
  options: VacuumBagOptions
  countryCode: string
  baseImage?: string | null
}) {
  const { combinations, colors, types, pack_size, pack_sizes, small_pack } = options
  // Selectable pack sizes (base first, e.g. [1000, 100]); base is the default.
  const packSizes = pack_sizes?.length ? pack_sizes : [pack_size]

  const t = useTranslations("vacuumConfigurator")
  const locale = useLocale()
  const money = (amount: number, currency_code: string) =>
    convertToLocale({ amount, currency_code, locale: LOCALE_TAG[locale] ?? "de-DE" })

  // Localized type name/description (keyed by slug), falling back to the DB value
  // (German) for locales without an override.
  const messages = useMessages() as any
  const typeInfo = messages?.vacuumConfigurator?.typeInfo ?? {}
  const typeLabel = (slug?: string | null, fallback?: string | null) =>
    typeInfo[slug ?? ""]?.name ?? fallback ?? ""
  const typeDesc = (slug?: string | null, fallback?: string | null) =>
    typeInfo[slug ?? ""]?.desc ?? fallback ?? ""

  // ─── Cascading value helpers (colour → type → width → height). Availability and
  //     price now depend on the colour: Transparent spans the whole matrix, other
  //     colours only their specific rows; a colour with no rows is "coming soon". ──
  const uniq = (arr: string[]) => Array.from(new Set(arr))
  const uniqSorted = (arr: number[]) => Array.from(new Set(arr)).sort((a, b) => a - b)
  const combosFor = (color: string) => combinations.filter((c) => c.color === color)
  const typesFor = (color: string) => uniq(combosFor(color).map((c) => c.type))
  const widthsFor = (color: string, type: string) =>
    uniqSorted(combosFor(color).filter((c) => c.type === type).map((c) => c.width_mm))
  const heightsFor = (color: string, type: string, w: number) =>
    uniqSorted(
      combosFor(color)
        .filter((c) => c.type === type && c.width_mm === w)
        .map((c) => c.height_mm)
    )

  /** Clamp a desired selection to a fully-valid one for its colour (no dead-ends).
   *  A colour with no priced rows keeps the other fields as-is (price row is null → UI
   *  shows "coming soon"). */
  const normalize = (desired: Selection): Selection => {
    const color =
      colors.find((c) => c.slug === desired.color)?.slug ?? colors[0]?.slug ?? ""
    const ts = typesFor(color)
    if (ts.length === 0) {
      return { color, type: desired.type, width_mm: desired.width_mm, height_mm: desired.height_mm }
    }
    const type = ts.includes(desired.type) ? desired.type : ts[0]
    const ws = widthsFor(color, type)
    const width_mm = ws.includes(desired.width_mm) ? desired.width_mm : ws[0]
    const hs = heightsFor(color, type, width_mm)
    const height_mm = hs.includes(desired.height_mm) ? desired.height_mm : hs[0]
    return { color, type, width_mm, height_mm }
  }

  const initialColor =
    colors.find((c) => c.slug === options.default_color)?.slug ??
    colors.find((c) => c.is_default)?.slug ??
    colors[0]?.slug ??
    ""
  const initialType =
    types.find((ty) => ty.slug === options.default_type)?.slug ??
    types.find((ty) => ty.is_default)?.slug ??
    types[0]?.slug ??
    ""

  const [sel, setSel] = useState<Selection>(() =>
    normalize({
      color: initialColor,
      type: initialType,
      width_mm: NaN,
      height_mm: NaN,
    })
  )
  const [quantity, setQuantity] = useState(1)
  // Pack size (Stück per pack). Base pack (e.g. 1000) is the default.
  const [packSize, setPackSize] = useState<number>(pack_size)
  const [hoverColor, setHoverColor] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (patch: Partial<Selection>) => {
    setAdded(false)
    setError(null)
    setSel((prev) => normalize({ ...prev, ...patch }))
  }

  // Dropdown value lists for the current colour + selection.
  const typeOptions = typesFor(sel.color) // type slugs available for this colour
  const widthOptions = widthsFor(sel.color, sel.type)
  const heightOptions = heightsFor(sel.color, sel.type, sel.width_mm)
  // Is the selected colour actually sold? If not → "coming soon".
  const colorHasOptions = typeOptions.length > 0

  // Exact price row (colour + type + width + height) for the normalized selection.
  const priceRow = useMemo(
    () =>
      combinations.find(
        (c) =>
          c.color === sel.color &&
          c.type === sel.type &&
          c.width_mm === sel.width_mm &&
          c.height_mm === sel.height_mm
      ),
    [combinations, sel]
  )

  const typeBySlug = useMemo(() => {
    const m = new Map<string, (typeof types)[number]>()
    for (const ty of types) m.set(ty.slug, ty)
    return m
  }, [types])

  const selectedColor = colors.find((c) => c.slug === sel.color)
  const selectedType = typeBySlug.get(sel.type)
  const hoveredColor = colors.find((c) => c.slug === hoverColor)

  // Image precedence: a hovered swatch wins; then a chosen coloured film; then the
  // type photo (glatt/geprägt); then Transparent's own photo; then the base image.
  const mainImage =
    hoveredColor?.image_url ??
    (selectedColor && !isTransparent(selectedColor.slug)
      ? selectedColor.image_url
      : null) ??
    selectedType?.image_url ??
    selectedColor?.image_url ??
    baseImage ??
    null
  const previewName = hoveredColor?.name ?? selectedColor?.name ?? ""

  const handleAdd = async () => {
    if (!priceRow) return
    setAdding(true)
    setError(null)
    const res = await addVacuumBagToCart({
      color: sel.color,
      type: sel.type,
      width_mm: sel.width_mm,
      height_mm: sel.height_mm,
      quantity,
      pack_size: packSize,
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
  // Matrix price is per base pack (e.g. 1000). The small pack (e.g. 100) is derived
  // from it with the same formula the backend charges (base / divisor × surcharge).
  const basePackPrice = priceRow?.price ?? 0
  const unitPrice =
    small_pack && packSize === small_pack.size
      ? round2((basePackPrice / small_pack.divisor) * small_pack.surcharge)
      : basePackPrice
  const totalPrice = unitPrice * quantity

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      {/* Preview image */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-ui-bg-subtle border border-ui-border-base flex items-center justify-center">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={t("imageAlt", { color: previewName })}
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="object-contain p-6 transition-opacity duration-200"
          />
        ) : (
          <div
            className="w-2/3 h-2/3 rounded-lg border border-ui-border-base"
            style={{ backgroundColor: selectedColor?.hex ?? "#e5e7eb" }}
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

        {/* Colour not sold yet → "coming soon" instead of the options/price. */}
        {!colorHasOptions && (
          <div className="rounded-base border border-ui-border-base bg-ui-bg-subtle px-4 py-6 text-sm">
            <p className="font-medium text-ui-fg-base">{selectedColor?.name}: bald verfügbar</p>
            <p className="text-ui-fg-subtle mt-1">
              Diese Farbe ist in Kürze bestellbar. Bitte wählen Sie vorerst eine andere Farbe.
            </p>
          </div>
        )}

        {colorHasOptions && (
          <>
        {/* Typ (product line) + Menge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ui-fg-base">{t("type")}</span>
            <select
              className={selectClass}
              value={sel.type}
              onChange={(e) => update({ type: e.target.value })}
            >
              {typeOptions.map((slug) => {
                const ty = typeBySlug.get(slug)
                return (
                  <option key={slug} value={slug}>
                    {typeLabel(slug, ty?.name)}
                  </option>
                )
              })}
            </select>
            {typeDesc(selectedType?.slug, selectedType?.description) && (
              <span className="text-xs text-ui-fg-subtle">
                {typeDesc(selectedType?.slug, selectedType?.description)}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ui-fg-base">
              {t("quantityLabel", { packSize })}
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
        </div>

        {/* Breite + Höhe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Packungsgröße — radio buttons (both visible), base pack default */}
        {packSizes.length > 1 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ui-fg-base">Packungsgröße</span>
            <div className="flex flex-wrap gap-3">
              {packSizes.map((ps) => {
                const isSel = ps === packSize
                return (
                  <label
                    key={ps}
                    className={`flex items-center gap-2 rounded-base border px-3 py-2 text-sm cursor-pointer transition ${
                      isSel
                        ? "border-brand-navy ring-2 ring-brand-navy/30"
                        : "border-ui-border-base hover:border-ui-border-interactive"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pack-size"
                      value={ps}
                      checked={isSel}
                      onChange={() => {
                        setAdded(false)
                        setPackSize(ps)
                      }}
                      className="accent-brand-navy"
                    />
                    <span>{ps.toLocaleString(LOCALE_TAG[locale] ?? "de-DE")} Stück</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex flex-col gap-0.5 border-t border-ui-border-base pt-4">
          {priceRow ? (
            <>
              <span className="text-2xl font-semibold text-ui-fg-base">
                {money(totalPrice, currency)}
              </span>
              <span className="text-sm text-ui-fg-subtle">
                {money(unitPrice, currency)} {t("perPack", { packSize })}
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
          </>
        )}
      </div>
    </div>
  )
}
