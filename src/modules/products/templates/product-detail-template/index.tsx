import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImageGallery from "@modules/products/components/product-image-gallery"
import ProductDetailActions from "@modules/products/components/product-detail-actions"
import ProductDetailTabs from "@modules/products/components/product-detail-tabs"
import { listProducts } from "@lib/data/products"

/**
 * Reads the optional add-on product ids off a product's metadata. Configurable
 * machines (e.g. the MULTIVAC C 500) store `metadata.addon_product_ids` — an
 * array of product ids offered as optional extras on the detail page. Products
 * without it behave exactly as before.
 */
function getAddonIds(product: HttpTypes.StoreProduct): string[] {
  const raw = (product.metadata as any)?.addon_product_ids
  if (Array.isArray(raw)) return raw.filter((id): id is string => typeof id === "string")
  if (typeof raw === "string") {
    // Tolerate a JSON-encoded array or a comma-separated string.
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === "string")
    } catch {
      return raw.split(",").map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export default async function ProductDetailTemplate({
  product,
  region,
  countryCode,
  images,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}) {
  const category = (product as any).categories?.[0]
  const categoryName = category?.name?.toUpperCase() ?? "PRODUKT"

  // Load add-on products (with region pricing) only when this product declares
  // them. Preserves the id order from metadata so they render as listed.
  const addonIds = getAddonIds(product)
  let addons: HttpTypes.StoreProduct[] = []
  if (addonIds.length > 0) {
    const { response } = await listProducts({
      regionId: region.id,
      queryParams: { id: addonIds, limit: addonIds.length },
    }).catch(() => ({ response: { products: [], count: 0 } }))
    const byId = new Map(response.products.map((p) => [p.id, p]))
    addons = addonIds.map((id) => byId.get(id)).filter((p): p is HttpTypes.StoreProduct => !!p)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 medium:px-6 py-4 medium:py-8 pb-24 medium:pb-8">

      {/* Title — always visible, above the two-column layout */}
      <div className="mb-4 medium:mb-6">
        <nav className="flex items-center gap-1.5 text-xs font-bold text-blue-600 tracking-widest uppercase mb-1 flex-wrap">
          <LocalizedClientLink href="/products" className="hover:text-blue-800">Produkte</LocalizedClientLink>
          {category && (
            <>
              <span className="text-ui-fg-muted">/</span>
              <LocalizedClientLink href={`/categories/${category.handle}`} className="hover:text-blue-800">
                {categoryName}
              </LocalizedClientLink>
            </>
          )}
        </nav>
        <h1 className="text-2xl medium:text-3xl font-bold text-ui-fg-base leading-tight">{product.title}</h1>
        {product.subtitle && (
          <p className="text-sm text-ui-fg-muted mt-1 leading-relaxed">{product.subtitle}</p>
        )}
      </div>

      {/* Main content — stacked on mobile, side by side on desktop */}
      <div className="flex flex-col medium:flex-row gap-4 medium:gap-10 mb-8">

        {/* Left: images */}
        <div className="w-full medium:flex-1">
          <ProductImageGallery images={images ?? []} title={product.title ?? ""} />
        </div>

        {/* Right: actions */}
        <div className="w-full medium:w-[440px] medium:shrink-0">
          <ProductDetailActions product={product} region={region} addons={addons} />
        </div>
      </div>

      {/* Tabs */}
      <ProductDetailTabs product={product} />

      {/* Breadcrumb — bottom */}
      <nav className="flex items-center gap-2 text-xs text-ui-fg-muted mt-6 flex-wrap">
        <LocalizedClientLink href="/" className="hover:text-ui-fg-base">Startseite</LocalizedClientLink>
        <span>›</span>
        <LocalizedClientLink href="/products" className="hover:text-ui-fg-base">Produkte</LocalizedClientLink>
        {category && (
          <>
            <span>›</span>
            <LocalizedClientLink href={`/categories/${category.handle}`} className="hover:text-ui-fg-base">
              {category.name}
            </LocalizedClientLink>
          </>
        )}
        <span>›</span>
        <span className="text-ui-fg-base font-medium line-clamp-1">{product.title}</span>
      </nav>

    </div>
  )
}
