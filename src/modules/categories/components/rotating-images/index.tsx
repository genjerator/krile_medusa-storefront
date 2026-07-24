"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export type RotatingImage = { src: string; alt: string }

/**
 * Cross-fading image rotator. Auto-advances through `images` on an interval and
 * exposes clickable dots. Client component (uses a timer + local state).
 */
export default function RotatingImages({
  images,
  interval = 4000,
}: {
  images: RotatingImage[]
  interval?: number
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(
      () => setActive((a) => (a + 1) % images.length),
      interval
    )
    return () => clearInterval(id)
  }, [images.length, interval])

  if (images.length === 0) return null

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-ui-bg-subtle">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Bild ${i + 1} anzeigen`}
              onClick={() => setActive(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? "bg-brand-navy" : "bg-white/70 ring-1 ring-black/10"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
