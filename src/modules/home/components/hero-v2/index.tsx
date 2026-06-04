"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SlideConfig = {
  readonly id: number
  readonly image: string
  readonly gradient: string
  readonly primaryHref: string
}

const SLIDE_CONFIGS: SlideConfig[] = [
  {
    id: 0,
    image: "/p-series.webp",
    gradient: "bg-gradient-to-br from-slate-900 to-slate-500",
    primaryHref: "/products",
  },
  {
    id: 1,
    image: "/C-Series.webp",
    gradient: "bg-gradient-to-br from-slate-900 to-slate-500",
    primaryHref: "/products",
  },
]

const AUTOPLAY_MS = 6000

export default function HeroV2() {
  const t = useTranslations("heroV2")
  const [current, setCurrent] = useState(0)
  const [quoteModal, setQuoteModal] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % SLIDE_CONFIGS.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [])

  const goTo = (i: number) => setCurrent(i)
  const goPrev = () => setCurrent((p) => (p - 1 + SLIDE_CONFIGS.length) % SLIDE_CONFIGS.length)
  const goNext = () => setCurrent((p) => (p + 1) % SLIDE_CONFIGS.length)

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
    touchStartX.current = null
  }

  return (
    <>
      <div
        className="relative w-full h-[42vh] min-h-[380px] small:h-[52vh] small:min-h-[460px] overflow-hidden bg-black"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slide track */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDE_CONFIGS.map((slide) => {
            const key = `slide${slide.id}` as "slide0" | "slide1"
            return (
              <div key={slide.id} className={`relative min-w-full h-full ${slide.gradient}`}>

                <Image
                  src={slide.image}
                  alt={t(`${key}.heading`)}
                  fill
                  sizes="100vw"
                  className="object-cover object-center scale-105 mix-blend-overlay opacity-40"
                  priority={slide.id === 0}
                />

                <div className="relative z-10 h-full content-container flex items-center">
                  <div className="w-full py-10 px-8 rounded-xl bg-white/10 backdrop-blur-sm">

                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-6 h-px bg-white/50" />
                      <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
                        {t(`${key}.label`)}
                      </span>
                    </div>

                    <h1 className="text-2xl small:text-4xl large:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5">
                      {t(`${key}.heading`)}
                    </h1>

                    <p className="text-sm small:text-base text-white/70 leading-relaxed mb-8 max-w-lg">
                      {t(`${key}.subheading`)}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <LocalizedClientLink
                        href={slide.primaryHref}
                        className="inline-flex items-center px-6 py-3 bg-white text-black text-sm font-semibold rounded hover:bg-white/90 transition-colors"
                      >
                        {t(`${key}.primaryCta`)}
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </LocalizedClientLink>
                      <button
                        onClick={() => setQuoteModal(true)}
                        className="inline-flex items-center px-6 py-3 border border-white/50 text-white text-sm font-semibold rounded hover:bg-white/10 hover:border-white transition-colors"
                      >
                        {t(`${key}.secondaryCta`)}
                      </button>
                    </div>

                    <p className="text-xs text-white/40 tracking-wide">
                      {t(`${key}.trust`)}
                    </p>

                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Slide counter — bottom left */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
          <span className="text-white text-sm font-medium tabular-nums">
            {String(current + 1).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {SLIDE_CONFIGS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  current === i ? "w-8 bg-white" : "w-3 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <span className="text-white/35 text-sm tabular-nums">
            {String(SLIDE_CONFIGS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Arrow navigation — bottom right */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="w-9 h-9 flex items-center justify-center border border-white/25 text-white/70 hover:border-white hover:text-white transition-colors rounded"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="w-9 h-9 flex items-center justify-center border border-white/25 text-white/70 hover:border-white hover:text-white transition-colors rounded"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

      </div>

      {/* Request Quote modal */}
      {quoteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setQuoteModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("modal.title")}</h2>
            <p className="text-gray-500 text-sm mb-6">{t("modal.description")}</p>
            <LocalizedClientLink
              href="/kontakt"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded hover:bg-gray-700 transition-colors"
              onClick={() => setQuoteModal(false)}
            >
              {t("modal.contactButton")}
            </LocalizedClientLink>
            <button
              onClick={() => setQuoteModal(false)}
              className="mt-3 w-full px-6 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t("modal.close")}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
