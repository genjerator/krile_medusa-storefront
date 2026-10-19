"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useLocale } from "next-intl"
import { MEDUSA_BACKEND_URL } from "@lib/config"

const BAG_IMAGE = "/configurator/vakuumbeutel-400x500.png"
const IMG_W = 1408
const IMG_H = 768
// Printable face of the bag (interior, below the seal), as fractions of the image.
const ZONE = { x: 0.298, y: 0.319, w: 0.29, h: 0.534 }
const MAX_MB = 3
const MIN_LOGO_PX = 200 // warn below this (too low-res for print)

type Props = {
  /** Optional: chosen bag options (type/color/size) to attach to the inquiry. */
  bagOptions?: Record<string, unknown>
  /** product_id sent with the inquiry (sentinel). */
  productId?: string
}

export default function LogoConfigurator({ bagOptions, productId = "branded-bag" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bagRef = useRef<HTMLImageElement | null>(null)
  const logoRef = useRef<HTMLImageElement | null>(null)
  const logoFileRef = useRef<File | null>(null)
  // placement in image px (kept in a ref so dragging doesn't re-render)
  const place = useRef({ cx: 0, cy: 0, fitW: 0, fitH: 0, scale: 1, opacity: 0.95 })
  const drag = useRef({ on: false, dx: 0, dy: 0 })

  const [hasLogo, setHasLogo] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [sizePct, setSizePct] = useState(100)
  const [opacityPct, setOpacityPct] = useState(95)
  const [showZone, setShowZone] = useState(true)
  const [lowRes, setLowRes] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const zonePx = () => ({ x: ZONE.x * IMG_W, y: ZONE.y * IMG_H, w: ZONE.w * IMG_W, h: ZONE.h * IMG_H })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, IMG_W, IMG_H)
    if (bagRef.current) ctx.drawImage(bagRef.current, 0, 0, IMG_W, IMG_H)

    if (showZone) {
      const z = zonePx()
      ctx.save()
      ctx.setLineDash([10, 8])
      ctx.lineWidth = 2
      ctx.strokeStyle = "rgba(184,64,44,.55)"
      ctx.strokeRect(z.x, z.y, z.w, z.h)
      ctx.restore()
    }
    if (logoRef.current) {
      const z = zonePx()
      const p = place.current
      const w = p.fitW * p.scale
      const h = p.fitH * p.scale
      ctx.save()
      ctx.beginPath()
      ctx.rect(z.x, z.y, z.w, z.h)
      ctx.clip()
      ctx.globalAlpha = p.opacity
      ctx.drawImage(logoRef.current, p.cx - w / 2, p.cy - h / 2, w, h)
      ctx.restore()
    }
  }, [showZone])

  // Load the bag image once.
  useEffect(() => {
    const img = new Image()
    img.onload = () => { bagRef.current = img; draw() }
    img.src = BAG_IMAGE
  }, [draw])

  useEffect(() => { draw() }, [draw, showZone])

  const fitLogoToZone = () => {
    const logo = logoRef.current!
    const z = zonePx()
    const r = Math.min(z.w / logo.naturalWidth, z.h / logo.naturalHeight)
    place.current.fitW = logo.naturalWidth * r
    place.current.fitH = logo.naturalHeight * r
    place.current.cx = z.x + z.w / 2
    place.current.cy = z.y + z.h / 2
  }

  const loadFile = (f?: File | null) => {
    if (!f) return
    setError(null)
    if (f.size > MAX_MB * 1024 * 1024) { setError(`Datei ist größer als ${MAX_MB} MB.`); return }
    const url = URL.createObjectURL(f)
    const img = new Image()
    img.onload = () => {
      logoRef.current = img
      logoFileRef.current = f
      fitLogoToZone()
      place.current.scale = 1
      place.current.opacity = 0.95
      setSizePct(100); setOpacityPct(95)
      setLowRes(Math.min(img.naturalWidth, img.naturalHeight) < MIN_LOGO_PX)
      setHasLogo(true)
      setFileName(f.name)
      draw()
    }
    img.onerror = () => setError("Logo konnte nicht geladen werden.")
    img.src = url
  }

  // ─── Drag ───────────────────────────────────────────────────────────────
  const toImg = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const r = canvas.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * IMG_W, y: ((e.clientY - r.top) / r.height) * IMG_H }
  }
  const overLogo = (p: { x: number; y: number }) => {
    if (!logoRef.current) return false
    const q = place.current
    const w = q.fitW * q.scale, h = q.fitH * q.scale
    return p.x >= q.cx - w / 2 && p.x <= q.cx + w / 2 && p.y >= q.cy - h / 2 && p.y <= q.cy + h / 2
  }
  const onPointerDown = (e: React.PointerEvent) => {
    const p = toImg(e)
    if (!overLogo(p)) return
    drag.current = { on: true, dx: p.x - place.current.cx, dy: p.y - place.current.cy }
    canvasRef.current!.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.on) return
    const p = toImg(e), z = zonePx()
    place.current.cx = Math.max(z.x, Math.min(z.x + z.w, p.x - drag.current.dx))
    place.current.cy = Math.max(z.y, Math.min(z.y + z.h, p.y - drag.current.dy))
    draw()
  }
  const onPointerUp = () => { drag.current.on = false }

  // ─── Upload + submit ────────────────────────────────────────────────────
  const locale = useLocale()
  const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const uploadBlob = async (blob: Blob, name: string): Promise<string> => {
    const fd = new FormData()
    fd.append("file", blob, name)
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/uploads`, {
      method: "POST",
      headers: { "x-publishable-api-key": pk },
      body: fd,
    })
    if (!res.ok) throw new Error("upload failed")
    const json = await res.json()
    return json.url as string
  }

  const canvasToBlob = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvasRef.current!.toBlob((b) => (b ? resolve(b) : reject(new Error("no blob"))), "image/png")
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!logoFileRef.current) { setError("Bitte laden Sie zuerst ein Logo hoch."); return }
    setSubmitting(true); setError(null)
    try {
      const logoUrl = await uploadBlob(logoFileRef.current, logoFileRef.current.name)
      const previewBlob = await canvasToBlob()
      const previewUrl = await uploadBlob(previewBlob, "vorschau.png")

      const p = place.current
      const body: Record<string, unknown> = {
        product_id: productId,
        name,
        email,
        phone: phone || undefined,
        message: message || "Anfrage für bedruckten Vakuumbeutel (eigenes Logo).",
        logo_url: logoUrl,
        preview_url: previewUrl,
        logo_name: logoFileRef.current.name,
        details: {
          placement: { cx: p.cx / IMG_W, cy: p.cy / IMG_H, scale: p.scale, opacity: p.opacity },
          bag: bagOptions ?? null,
        },
        locale,
        source_url: typeof window !== "undefined" ? window.location.href : undefined,
        ...(website ? { website } : {}),
      }
      await fetch(`${MEDUSA_BACKEND_URL}/store/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-publishable-api-key": pk },
        body: JSON.stringify(body),
      }).then((r) => { if (!r.ok) throw new Error("inquiry failed") })
      setSuccess(true)
    } catch {
      setError("Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.")
    } finally {
      setSubmitting(false)
    }
  }

  const resetAll = () => {
    if (!logoRef.current) return
    fitLogoToZone()
    place.current.scale = 1; place.current.opacity = 0.95
    setSizePct(100); setOpacityPct(95); draw()
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-ui-border-base bg-ui-bg-subtle p-8 text-center">
        <h3 className="text-lg font-semibold text-ui-fg-base mb-2">Vielen Dank!</h3>
        <p className="text-sm text-ui-fg-subtle">
          Ihre Anfrage mit Logo wurde übermittelt. Wir melden uns in Kürze mit einem Angebot bei Ihnen.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 medium:grid-cols-[1.4fr_1fr] gap-6 items-start">
      {/* Preview */}
      <div className="rounded-2xl border border-ui-border-base bg-white p-3 shadow-sm">
        <div className="rounded-lg overflow-hidden" style={{ touchAction: "none" }}>
          <canvas
            ref={canvasRef}
            width={IMG_W}
            height={IMG_H}
            className="block w-full h-auto cursor-grab"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label="Vorschau des Vakuumbeutels mit Ihrem Logo"
          />
        </div>
        <p className="text-xs text-ui-fg-muted mt-2 px-1">
          {hasLogo ? "Logo verschieben: ziehen. Größe/Deckkraft: rechts einstellen." : "Laden Sie Ihr Logo hoch – es wird mittig im Druckbereich platziert."}
        </p>
      </div>

      {/* Controls + form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-ui-border-base bg-white p-5 shadow-sm">
        <label className="block border-[1.5px] border-dashed border-ui-border-base rounded-xl p-5 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition-colors">
          <input type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])} />
          <span className="block font-semibold text-brand-navy">Logo hochladen</span>
          <span className="block text-xs text-ui-fg-muted mt-1">Transparentes PNG oder SVG · max. {MAX_MB} MB</span>
          {fileName && <span className="block text-xs text-blue-600 mt-2 break-all">{fileName}</span>}
        </label>
        {lowRes && <p className="text-xs text-amber-600 mt-2">Hinweis: Das Logo hat eine niedrige Auflösung und wird im Druck evtl. unscharf.</p>}

        <div className={`mt-5 ${hasLogo ? "" : "opacity-40 pointer-events-none"}`}>
          <label className="flex justify-between text-sm font-semibold mb-1.5">Größe <span className="text-ui-fg-muted font-normal">{sizePct} %</span></label>
          <input type="range" min={20} max={150} value={sizePct} className="w-full"
            onChange={(e) => { const v = +e.target.value; setSizePct(v); place.current.scale = v / 100; draw() }} />
          <label className="flex justify-between text-sm font-semibold mb-1.5 mt-4">Deckkraft <span className="text-ui-fg-muted font-normal">{opacityPct} %</span></label>
          <input type="range" min={30} max={100} value={opacityPct} className="w-full"
            onChange={(e) => { const v = +e.target.value; setOpacityPct(v); place.current.opacity = v / 100; draw() }} />
          <label className="flex items-center gap-2 mt-4 text-sm">
            <input type="checkbox" checked={showZone} onChange={(e) => setShowZone(e.target.checked)} /> Druckbereich anzeigen
          </label>
          <button type="button" onClick={resetAll} className="text-xs text-blue-600 mt-3 hover:underline">Zurücksetzen</button>
        </div>

        <div className="mt-5 border-t border-ui-border-base pt-5 space-y-3">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border border-ui-border-base rounded-lg px-3 py-2 text-sm" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" className="w-full border border-ui-border-base rounded-lg px-3 py-2 text-sm" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon (optional)" className="w-full border border-ui-border-base rounded-lg px-3 py-2 text-sm" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nachricht (optional) – z. B. Menge, Größe, Farbe" rows={3} maxLength={256} className="w-full border border-ui-border-base rounded-lg px-3 py-2 text-sm" />
          {/* Honeypot */}
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full mt-4 bg-brand-navy text-white font-semibold py-3 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50">
          {submitting ? "Wird gesendet…" : "Angebot anfordern"}
        </button>
        <p className="text-[11px] text-ui-fg-muted mt-3 leading-relaxed">
          Ihr Logo und die Vorschau werden mit der Anfrage an uns übermittelt. Wir erstellen Ihnen ein individuelles Angebot.
        </p>
      </form>
    </div>
  )
}
