import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  const topLevelCategories = productCategories?.filter(
    (c) => !c.parent_category
  ) ?? []

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full gap-3">
        <div className="flex flex-row items-start">
          <div className="flex flex-row gap-12">
            {topLevelCategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="txt-compact-small font-semibold text-ui-fg-base uppercase tracking-wider">
                  Categories
                </span>
                <ul className="flex flex-col gap-1" data-testid="footer-categories">
                  {topLevelCategories.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="txt-compact-small text-ui-fg-subtle hover:text-ui-fg-base"
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="txt-compact-small font-semibold text-ui-fg-base uppercase tracking-wider">
                  Collections
                </span>
                <ul className="flex flex-col gap-1">
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="txt-compact-small text-ui-fg-subtle hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-ui-border-base pt-2">
          <Text className="txt-compact-small text-ui-fg-muted">
            © {new Date().getFullYear()} Planeta. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  )
}
