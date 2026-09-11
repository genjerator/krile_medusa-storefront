"use client"

import { useEffect, useState } from "react"

/**
 * Discreet migration marker. Renders nothing unless the URL carries
 * `?source=true`; then it prints "strato" or "aws" in the footer so we can
 * confirm which stack served the page during the DNS switch to the Strato VPS.
 *
 * Detection: the Strato Caddy adds an `X-Served-By` response header (see the
 * backend Caddyfile). A same-origin HEAD reads it back — present ("strato-vps")
 * → "strato", absent → "aws" (old stack). Remove once the migration is verified.
 */
export default function SourceMarker() {
  const [source, setSource] = useState<string | null>(null)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("source") !== "true") {
      return
    }
    let cancelled = false
    fetch(window.location.href, { method: "HEAD", cache: "no-store" })
      .then((res) => {
        const servedBy = res.headers.get("x-served-by") || ""
        if (!cancelled) setSource(/strato/i.test(servedBy) ? "strato" : "aws")
      })
      .catch(() => {
        if (!cancelled) setSource("aws")
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!source) return null

  return (
    <span className="txt-compact-small text-ui-fg-muted font-mono">{source}</span>
  )
}
