"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NAV_LINKS = [
  { label: "Ihr Produkt", href: "/store" },
  { label: "Training", href: "/training" },
  { label: "Kontakt", href: "/kontakt" },
]

export default function MobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="small:hidden text-white p-1"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        )}
      </button>

      {menuOpen && (
        <div className="small:hidden absolute top-16 right-0 bg-brand-navy/80 backdrop-blur-sm rounded-bl-lg z-50">
          <div className="flex flex-col py-4 px-6 gap-4">
            {NAV_LINKS.map((link) => (
              <LocalizedClientLink
                key={link.href}
                href={link.href}
                className="text-white text-sm hover:text-white/70 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </LocalizedClientLink>
            ))}
            <LocalizedClientLink
              href="/account"
              className="text-white text-sm hover:text-white/70 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Account
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </>
  )
}
