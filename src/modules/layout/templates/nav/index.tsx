import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "./mobile-menu"

const NAV_LINKS = [
  { label: "Ihr Produkt", href: "/store" },
  { label: "Training", href: "/training" },
  { label: "Kontakt", href: "/kontakt" },
]

export default function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto duration-200 bg-brand-navy">
        <nav className="content-container flex items-center justify-between w-full h-full">

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus text-white hover:text-white/70 uppercase shrink-0"
            data-testid="nav-store-link"
          >
            Planeta
          </LocalizedClientLink>

          {/* Desktop nav links */}
          <div className="hidden small:flex items-center gap-x-8 h-full">
            {NAV_LINKS.map((link) => (
              <LocalizedClientLink
                key={link.href}
                href={link.href}
                className="text-white text-sm hover:text-white/70 transition-colors whitespace-nowrap"
              >
                {link.label}
              </LocalizedClientLink>
            ))}
          </div>

          {/* Right: account + cart + hamburger */}
          <div className="flex items-center gap-x-4">
            <LocalizedClientLink
              className="hidden small:block text-white text-sm hover:text-white/70"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-white hover:text-white/70 flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>

            <MobileMenu />
          </div>

        </nav>
      </header>
    </div>
  )
}
