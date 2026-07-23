import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { descriptionToHtml } from "@lib/util/description-html"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {product.description && (
          <div
            className="text-medium text-ui-fg-subtle [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:underline [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-ui-border-base [&_th]:bg-ui-bg-subtle [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-ui-border-base [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_th_p]:mb-0 [&_td_p]:mb-0"
            data-testid="product-description"
            dangerouslySetInnerHTML={{ __html: descriptionToHtml(product.description) }}
          />
        )}
      </div>
    </div>
  )
}

export default ProductInfo
