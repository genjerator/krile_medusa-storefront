import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImageGallery from "@modules/products/components/product-image-gallery"
import ProductDetailActions from "@modules/products/components/product-detail-actions"
import ProductDetailTabs from "@modules/products/components/product-detail-tabs"

const featureBadges = [
  { icon: "🛡", title: "MADE IN GERMANY" },
  { icon: "⚙", title: "PREMIUM QUALITÄT" },
  { icon: "🔧", title: "LANGLEBIG & ZUVERLÄSSIG" },
  { icon: "🎧", title: "WELTWEITER SERVICE" },
]

export default function ProductDetailTemplate({
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

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ui-fg-muted mb-6">
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

      {/* Mobile: title on top */}
      <div className="medium:hidden mb-6">
        <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1">{categoryName}</p>
        <h1 className="text-2xl font-bold text-ui-fg-base leading-tight">{product.title}</h1>
        {product.subtitle && (
          <p className="text-sm text-ui-fg-muted mt-2 leading-relaxed">{product.subtitle}</p>
        )}
      </div>

      {/* Main content — mobile: stacked, desktop: side by side */}
      <div className="flex flex-col medium:flex-row gap-6 medium:gap-10 mb-8">
        {/* Images */}
        <div className="w-full medium:flex-1 flex flex-col gap-6">
          <ProductImageGallery images={images ?? []} title={product.title ?? ""} />

          {(images?.length ?? 0) <= 1 && (
            <div className="grid grid-cols-2 small:grid-cols-4 gap-3">
              {featureBadges.map((f) => (
                <div key={f.title} className="border border-ui-border-base rounded-lg p-3 flex flex-col items-center gap-2 text-center">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-xs font-bold text-ui-fg-base tracking-wide leading-tight">{f.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: title + actions on right */}
        <div className="w-full medium:w-[460px] medium:shrink-0">
          <div className="hidden medium:block mb-4">
            <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">{categoryName}</p>
            <h1 className="text-3xl font-bold text-ui-fg-base mb-3 leading-tight">{product.title}</h1>
            {product.subtitle && (
              <p className="text-sm text-ui-fg-muted mb-4 leading-relaxed">{product.subtitle}</p>
            )}
          </div>
          <ProductDetailActions product={product} region={region} />
        </div>
      </div>

      {/* Tabs section */}
      <ProductDetailTabs product={product} />
    </div>
  )
}
