"use client"

import { useSearchParams } from "next/navigation"
import LogoConfigurator from "@modules/vacuum-bags/components/logo-configurator"

/**
 * Feature-flagged wrapper for the branded-bag logo tool. Only renders when the
 * URL carries `?logo=true` — so the section (heading + configurator) stays
 * hidden on the live page until the flag is set (preview/rollout gate).
 * Must sit inside a <Suspense> boundary (useSearchParams).
 */
export default function BrandedBagSection() {
  const searchParams = useSearchParams()
  if (searchParams.get("logo") !== "true") return null

  return (
    <div className="mt-16 pt-10 border-t border-ui-border-base">
      <h2 className="text-xl medium:text-2xl font-bold text-ui-fg-base mb-2">
        Eigenes Logo auf dem Vakuumbeutel
      </h2>
      <p className="text-sm text-ui-fg-subtle leading-relaxed max-w-3xl mb-8">
        Deine Verpackung, deine Regeln: Laden Sie Ihr Logo hoch, platzieren Sie es
        auf dem Beutel und fordern Sie ein unverbindliches Angebot an.
      </p>
      <LogoConfigurator />
    </div>
  )
}
