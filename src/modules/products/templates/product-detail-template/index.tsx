import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImageGallery from "@modules/products/components/product-image-gallery"
import ProductDetailActions from "@modules/products/components/product-detail-actions"
import ProductDetailTabs from "@modules/products/components/product-detail-tabs"


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
    <div className="max-w-[1200px] mx-auto px-4 medium:px-6 py-4 medium:py-8 pb-24 medium:pb-8">

      {/* Title — always visible, above the two-column layout */}
      <div className="mb-4 medium:mb-6">
        <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1">{categoryName}</p>
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
          <ProductDetailActions product={product} region={region} />
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
