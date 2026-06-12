"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"

export default function ProductImageGallery({
  images,
  title,
}: {
  images: HttpTypes.StoreProductImage[]
  title: string
}) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const validImages = images?.filter((i) => i.url) ?? []

  if (!validImages.length) {
    return (
      <div className="aspect-[4/3] bg-ui-bg-subtle rounded-lg flex items-center justify-center">
        <svg className="w-24 h-24 text-ui-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  const prev = () => setActive((i) => (i - 1 + validImages.length) % validImages.length)
  const next = () => setActive((i) => (i + 1) % validImages.length)

  // Lock body scroll + keyboard navigation while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
      else if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
    }

    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxOpen, validImages.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] bg-ui-bg-subtle rounded-lg overflow-hidden border border-ui-border-base group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {validImages.map((img, i) => (
          <Image
            key={img.id ?? i}
            src={img.url}
            alt={`${title} ${i + 1}`}
            fill
            onClick={() => setLightboxOpen(true)}
            className={`object-contain p-6 transition-opacity duration-200 cursor-zoom-in ${active === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            sizes="(max-width: 768px) 100vw, 500px"
            priority={i === 0}
            loading={i === 0 ? undefined : "eager"}
          />
        ))}

        {/* Arrows — only if >1 image */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Vorheriges Bild"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-ui-border-base rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <svg className="w-4 h-4 text-ui-fg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Nächstes Bild"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-ui-border-base rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <svg className="w-4 h-4 text-ui-fg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    active === i ? "bg-blue-600" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Horizontal thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2">
          {validImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                active === i
                  ? "border-blue-600"
                  : "border-ui-border-base hover:border-ui-border-strong"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="80px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Schließen"
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image — stop propagation so clicking it doesn't close */}
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validImages[active].url}
              alt={`${title} ${active + 1}`}
              fill
              className="object-contain p-4 medium:p-10 cursor-zoom-out"
              sizes="100vw"
              onClick={() => setLightboxOpen(false)}
              priority
            />
          </div>

          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Vorheriges Bild"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Nächstes Bild"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {validImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActive(i) }}
                    aria-label={`Bild ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      active === i ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
