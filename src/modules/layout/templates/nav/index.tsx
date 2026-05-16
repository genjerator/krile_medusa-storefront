import { Suspense } from "react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import MobileMenu from "./mobile-menu"

export default async function Nav() {
  const t = await getTranslations("nav")

  const NAV_LINKS = [
    { label: t("products"), href: "/store" },
    { label: t("training"), href: "/service" },
    { label: t("contact"), href: "/kontakt" },
    { label: t("informations"), href: "/informations" },
  ]
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto duration-200 bg-brand-navy">
        <nav className="content-container flex items-center justify-between w-full h-full">

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="shrink-0 hover:opacity-80 transition-opacity"
            data-testid="nav-store-link"
          >
            <Image
              src="/planeta_logo.png"
              alt="Planeta"
              width={60}
              height={20}
              className="h-5 w-auto object-contain"
              priority
            />
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

          {/* Right: language + account + cart + hamburger */}
          <div className="flex items-center gap-x-4">
            <LanguageSwitcher />
            <LocalizedClientLink
              className="hidden small:block text-white text-sm hover:text-white/70"
              href="/account"
              data-testid="nav-account-link"
            >
              {t("account")}
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
