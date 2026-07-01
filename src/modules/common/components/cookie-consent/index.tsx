"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const GA_ID = "G-CN1PX0WWDT"
const STORAGE_KEY = "cookie-consent"

type Consent = "accepted" | "declined"

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null)
  // Assume a decision has been made until we've checked storage — avoids a flash of the banner
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored)
    } else {
      setShowBanner(true)
    }
  }, [])

  const choose = (value: Consent) => {
    localStorage.setItem(STORAGE_KEY, value)
    setConsent(value)
    setShowBanner(false)
  }

  return (
    <>
      {/* Google Analytics — only loaded after explicit consent */}
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie-Hinweis"
          className="fixed bottom-4 inset-x-4 z-[1000] mx-auto max-w-md rounded-lg border border-ui-border-base bg-white p-4 shadow-lg sm:inset-x-auto sm:right-4"
        >
          <p className="text-sm text-ui-fg-base leading-relaxed">
            Diese Website verwendet Cookies für Statistik- und Analysezwecke.
            Sie können selbst entscheiden, ob Sie diese zulassen möchten. Mehr dazu in
            unserer{" "}
            <LocalizedClientLink
              href="/datenschutz"
              className="underline hover:text-blue-700"
            >
              Datenschutzerklärung
            </LocalizedClientLink>
            .
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => choose("declined")}
              className="rounded-md border border-ui-border-base px-4 py-2 text-sm font-medium text-ui-fg-base hover:bg-ui-bg-subtle transition-colors"
            >
              Ablehnen
            </button>
            <button
              onClick={() => choose("accepted")}
              className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 transition-colors"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      )}
    </>
  )
}
