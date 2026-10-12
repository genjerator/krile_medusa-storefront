import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SourceMarker from "@modules/common/components/source-marker"

export default async function Footer() {
  // NOTE: the footer category list is currently commented out below, so we no
  // longer fetch categories here. listCategories() pulled ~1.8 MB from Medusa
  // (it requests *products for every category) on EVERY page render via the
  // layout — a large, uncacheable, unused call. Re-add a slim fetch (name/handle
  // only) here if the category list is restored.
  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full gap-3">
        <div className="flex flex-row items-start">
          <div className="flex flex-row gap-12">
            {/* topLevelCategories.length > 0 && (
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
            ) */}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Text className="txt-compact-small text-ui-fg-muted">
            © {new Date().getFullYear()} Planeta. Alle Rechte vorbehalten.
          </Text>
          <div className="flex items-center gap-x-3">
            <a
              href="https://planeta.de"
              target="_blank"
              rel="noreferrer"
              className="txt-compact-small text-ui-fg-subtle hover:text-ui-fg-base"
            >
              planeta.de
            </a>
            <SourceMarker />
          </div>
        </div>
      </div>
    </footer>
  )
}
