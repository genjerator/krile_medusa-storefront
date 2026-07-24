"use client"

import { ReactNode, useMemo, useState } from "react"

type Section = { title: string; contentHtml: string }

/**
 * Splits a content-block's HTML into sections at each heading (h1–h6). Any
 * markup before the first heading is returned as `intro`. Deterministic and
 * SSR-safe (pure string parsing, no DOMParser) so server and client render the
 * same markup — no hydration mismatch, content present for SEO.
 */
function parseSections(html: string): { intro: string; sections: Section[] } {
  const firstHeading = html.search(/<h[1-6][^>]*>/i)
  if (firstHeading === -1) return { intro: html, sections: [] }

  const intro = firstHeading > 0 ? html.slice(0, firstHeading) : ""
  const rest = html.slice(firstHeading)

  const sections: Section[] = []
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[1-6][^>]*>|$)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(rest)) !== null) {
    const title = m[2].replace(/<[^>]+>/g, "").trim()
    sections.push({ title, contentHtml: m[3].trim() })
  }
  return { intro, sections }
}

const PROSE =
  "text-ui-fg-subtle [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:underline [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-ui-border-base [&_th]:bg-ui-bg-subtle [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-ui-border-base [&_td]:px-3 [&_td]:py-2 [&_td]:align-top"

const ThermometerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0 text-brand-navy"
    aria-hidden="true"
  >
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-5 w-5 shrink-0 text-ui-fg-muted transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

/**
 * Renders a content block as a collapsible list: only the headlines show, and
 * clicking a headline reveals the text beneath it. The first headline is marked
 * with a thermometer icon; every headline has a chevron that rotates when open.
 */
export default function ContentBlockAccordion({
  html,
  icons,
}: {
  html: string
  /** Optional leading icon per headline (by index). Falls back to a
   *  thermometer on the first headline when omitted. */
  icons?: ReactNode[]
}) {
  const { intro, sections } = useMemo(() => parseSections(html), [html])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // No headings to collapse — fall back to plain rich text.
  if (sections.length === 0) {
    return <div className={`max-w-3xl ${PROSE}`} dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="max-w-3xl">
      {intro.trim() && (
        <div className={`mb-4 ${PROSE}`} dangerouslySetInnerHTML={{ __html: intro }} />
      )}

      <div className="divide-y divide-ui-border-base border-y border-ui-border-base">
        {sections.map((section, i) => {
          const open = openIndex === i
          const leading = icons ? icons[i] : i === 0 ? <ThermometerIcon /> : null
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 py-4 text-left"
              >
                {leading}
                <span className="flex-1 text-base font-semibold text-ui-fg-base">
                  {section.title}
                </span>
                <ChevronIcon open={open} />
              </button>
              {open && (
                <div
                  className={`pb-4 ${PROSE}`}
                  dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
