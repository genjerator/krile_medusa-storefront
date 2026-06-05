"use client"

import { useState, useEffect } from "react"
import ContentBox from "@modules/common/components/content-box"

type VideoItem = { id: number; src: string; title: string; poster?: string }

const VIDEOS: VideoItem[] = [
  { id: 1, src: "https://dpc56b2hptc18.cloudfront.net/Customer+video+Bull+%26+Claw_EN+with+subtitles.mp4", title: "Customer Video Bull & Claw", poster: "/video-1-poster.webp" },
  { id: 2, src: "https://dpc56b2hptc18.cloudfront.net/Customer+video+Metzgerei+Wenisch_EN.mp4", title: "Customer Video Metzgerei Wenisch", poster: "/video-2-poster.webp" },
  { id: 3, src: "https://dpc56b2hptc18.cloudfront.net/Customer+video+Suinco.mp4", title: "Customer Video Suinco", poster: "/video-3-poster.webp" },
  { id: 4, src: "https://dpc56b2hptc18.cloudfront.net/Customer+Video+Waldburger.mp4", title: "Customer Video Waldburger", poster: "/video-4-poster.webp" },
  { id: 5, src: "https://dpc56b2hptc18.cloudfront.net/Sales+video+C+200.mp4", title: "Sales Video C 200", poster: "/video-5-poster.webp" },
  { id: 6, src: "https://dpc56b2hptc18.cloudfront.net/Sales+video+BASELINE+P+200.mp4", title: "Sales Video BASELINE P 200", poster: "/video-6-poster.webp" },
]

const SMALL = 1024

export default function FeaturedFour() {
  const [isDesktop, setIsDesktop] = useState(true)
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${SMALL}px)`)
    const update = (e: MediaQueryList | MediaQueryListEvent) => {
      setIsDesktop(e.matches)
      setVisibleCount(e.matches ? 3 : 1)
    }
    update(mq)
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const initialCount = isDesktop ? 3 : 1
  const step = isDesktop ? 3 : 1
  const hasMore = visibleCount < VIDEOS.length
  const isExpanded = visibleCount > initialCount

  return (
    <div className="content-container py-6">

      {/* Text section */}
      <div className="flex flex-col items-center text-center mb-8 gap-4">
        <p className="text-xl font-semibold text-ui-fg-base">VAKUUMVERPACKT KONSERVIEREN</p>
        <p className="text-ui-fg-subtle text-sm leading-relaxed max-w-2xl">
          Technik, die Ihre Küche radikal verändert.<br />
          Technologie, die die Haltbarkeit der Produkte verlängert.<br />
          Sicherheit, die Geschmack und Qualität garantiert.
        </p>
      </div>

      {/* Outer box */}
      <div className="rounded-xl border border-ui-border-base bg-white shadow-sm p-4 small:p-6">

        {/* Header: title left */}
        <h2 className="text-lg font-semibold text-ui-fg-base mb-4">Videos</h2>

        {/* Video grid */}
        <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
          {VIDEOS.slice(0, visibleCount).map((video) => (
            <ContentBox key={video.id} title={video.title} aspectRatio="video">
              <video
                src={video.src}
                poster={video.poster}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </ContentBox>
          ))}
        </div>

        {/* Footer: more videos / hide buttons */}
        {(hasMore || isExpanded) && (
          <div className="flex justify-end items-center gap-4 mt-4">
            {isExpanded && (
              <button
                onClick={() => setVisibleCount(initialCount)}
                className="group flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-slate-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Hide
              </button>
            )}
            {hasMore && (
              <button
                onClick={() => setVisibleCount((v) => Math.min(v + step, VIDEOS.length))}
                className="group flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-slate-400 hover:text-slate-900 transition-colors"
              >
                More videos
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
