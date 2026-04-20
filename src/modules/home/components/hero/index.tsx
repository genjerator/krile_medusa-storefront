"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react"
import { Button, Heading } from "@medusajs/ui"

type Slide = {
  readonly id: number
  readonly bg: string
  readonly heading: string
  readonly subtitle: string
  readonly ctaLabel: string
  readonly ctaHref: string
}

const SLIDES: Slide[] = [
  {
    id: 0,
    bg: "bg-gradient-to-br from-slate-900 to-slate-700",
    heading: "New Season Arrivals",
    subtitle: "Discover the latest trends crafted for every occasion.",
    ctaLabel: "Shop Now",
    ctaHref: "/store",
  },
  {
    id: 1,
    bg: "bg-gradient-to-br from-rose-800 to-orange-500",
    heading: "Summer Sale — Up to 40% Off",
    subtitle: "Limited time offers on our most-loved collections.",
    ctaLabel: "View Deals",
    ctaHref: "/store",
  },
  {
    id: 2,
    bg: "bg-gradient-to-br from-emerald-800 to-teal-500",
    heading: "Free Shipping on Orders Over $75",
    subtitle: "Shop confidently with fast, tracked delivery worldwide.",
    ctaLabel: "Start Shopping",
    ctaHref: "/store",
  },
]

const AUTOPLAY_INTERVAL_MS = 5000

const Hero = (): JSX.Element => {
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, AUTOPLAY_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number): void => {
    setCurrent(index)
  }

  const goPrev = (): void => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const goNext = (): void => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }

  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative overflow-hidden">
      {/* Slide track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full h-full flex flex-col justify-center items-center text-center small:p-32 gap-6 ${slide.bg}`}
          >
            <span>
              <Heading
                level="h1"
                className="text-3xl leading-10 text-white font-normal"
              >
                {slide.heading}
              </Heading>
              <Heading
                level="h2"
                className="text-3xl leading-10 text-white/80 font-normal"
              >
                {slide.subtitle}
              </Heading>
            </span>
            <a href={slide.ctaHref}>
              <Button variant="secondary">{slide.ctaLabel}</Button>
            </a>
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((slide) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(slide.id)}
            aria-label={`Go to slide ${slide.id + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              current === slide.id
                ? "bg-white"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
