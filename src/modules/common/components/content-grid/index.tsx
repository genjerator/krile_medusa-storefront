"use client"

import { useState, useEffect, ReactNode } from "react"

type ContentGridProps = {
  items: ReactNode[]
  loadMoreLabel?: string
  moreLabel?: string
}

const SMALL = 1024

export default function ContentGrid({
  items,
  loadMoreLabel = "Load more",
  moreLabel = "More",
}: ContentGridProps) {
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

  const step = isDesktop ? 3 : 1
  const hasMore = visibleCount < items.length

  return (
    <>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        {items.slice(0, visibleCount).map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((v) => Math.min(v + step, items.length))}
            className="px-6 py-2.5 text-sm font-medium rounded-full border border-ui-border-base bg-white hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            {isDesktop ? loadMoreLabel : moreLabel}
          </button>
        </div>
      )}
    </>
  )
}
