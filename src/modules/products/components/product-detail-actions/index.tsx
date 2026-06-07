"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import AngebotModal from "@modules/products/components/angebot-modal"

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant["options"]) =>
  variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})

export default function ProductDetailActions({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [angebotOpen, setAngebotOpen] = useState(false)

  // Preselect if only 1 variant
  useEffect(() => {
    if (product.variants?.length === 1) {
      setOptions(optionsAsKeymap(product.variants[0].options) ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() =>
    product.variants?.find((v) => isEqual(optionsAsKeymap(v.options), options)),
    [product.variants, options]
  )

  const isValidVariant = useMemo(() =>
    product.variants?.some((v) => isEqual(optionsAsKeymap(v.options), options)),
    [product.variants, options]
  )

  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory) return true
    if (selectedVariant.allow_backorder) return true
    return (selectedVariant.inventory_quantity ?? 0) > 0
  }, [selectedVariant])

  // Sync variant id to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null
    if (params.get("v_id") === value) return
    value ? params.set("v_id", value) : params.delete("v_id")
    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const { cheapestPrice } = getProductPrice({ product })
  const displayPrice = selectedVariant
    ? getProductPrice({ product, variantId: selectedVariant.id }).variantPrice
    : cheapestPrice

  const sku = selectedVariant?.sku ?? product.variants?.[0]?.sku ?? `${(product.handle ?? "").toUpperCase().slice(0, 8)}-001`

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity, countryCode })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Price */}
      {displayPrice && (
        <div>
          <p className="text-3xl font-bold text-blue-700">{displayPrice.calculated_price}</p>
        </div>
      )}


      <div className="border-t border-ui-border-base pt-5 space-y-4">
        {/* Variant options */}
        {product.options?.map((opt) => (
          <div key={opt.id} className="flex items-center gap-4">
            <span className="text-sm text-ui-fg-subtle w-28 shrink-0">{opt.title}</span>
            <select
              className="flex-1 border border-ui-border-base rounded px-3 py-2 text-sm bg-white text-ui-fg-base focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={options[opt.id] ?? ""}
              onChange={(e) => setOptions((prev) => ({ ...prev, [opt.id]: e.target.value }))}
            >
              <option value="">Bitte auswählen</option>
              {opt.values?.map((v) => (
                <option key={v.id} value={v.value}>{v.value}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Quantity + delivery */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-ui-fg-subtle w-28 shrink-0">Menge</span>
          <div className="flex items-center border border-ui-border-base rounded overflow-hidden">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-ui-bg-subtle transition-colors text-lg">−</button>
            <span className="px-4 py-2 text-sm border-x border-ui-border-base min-w-[3rem] text-center">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 hover:bg-ui-bg-subtle transition-colors text-lg">+</button>
          </div>
{/*           <div className="flex items-center gap-1.5 text-sm text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Lieferzeit: 2–3 Wochen
          </div> */}
        </div>
      </div>

      {/* CTA buttons — sticky on mobile */}
      <div className="space-y-3 medium:static fixed bottom-0 left-0 right-0 medium:p-0 p-3 bg-white medium:bg-transparent border-t medium:border-0 border-ui-border-base z-40">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || isAdding || !isValidVariant}
          className="w-full bg-brand-navy text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {isAdding ? "Wird hinzugefügt..." : !selectedVariant ? "Variante auswählen" : !inStock ? "Nicht verfügbar" : "In den Warenkorb"}
        </button>
        {(cheapestPrice?.calculated_price_number ?? 0) >= 1000 && (
          <button
            type="button"
            onClick={() => setAngebotOpen(true)}
            className="w-full border border-ui-border-base text-ui-fg-base py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-ui-bg-subtle transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Angebot anfordern
          </button>
        )}
      </div>

      {angebotOpen && (
        <AngebotModal
          productId={product.id!}
          productTitle={product.title ?? ""}
          onClose={() => setAngebotOpen(false)}
        />
      )}

      {/* SKU */}
      <p className="text-sm text-ui-fg-muted">
        SKU: <span className="text-ui-fg-base font-medium">{sku}</span>
      </p>
    </div>
  )
}
