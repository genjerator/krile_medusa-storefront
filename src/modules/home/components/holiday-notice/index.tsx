import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Row = {
  icon: React.ReactNode
  text: React.ReactNode
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-5 h-5",
}

const ROWS: Row[] = [
  {
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    text: (
      <>
        Bitte beachten Sie, dass unser Unternehmen in der Zeit vom{" "}
        <strong className="text-white">18.08.2026 bis einschließlich 10.09.2026</strong>{" "}
        aufgrund unseres Sommerurlaubs geschlossen ist.
      </>
    ),
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </svg>
    ),
    text: (
      <>
        Anfragen und Aufträge, die während dieser Zeit bei uns eingehen,
        werden nach unserer Rückkehr ab dem{" "}
        <strong className="text-white">11.09.2026</strong> bearbeitet.
      </>
    ),
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 6l10 7 10-7" />
      </svg>
    ),
    text: <>Während unseres Urlaubs sind wir per E-Mail weiterhin erreichbar.</>,
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="4" />
        <path d="M3 12h2M19 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
      </svg>
    ),
    text: (
      <>
        Wir wünschen unseren Kunden eine schöne Sommerzeit und freuen uns,
        Sie nach unserem Urlaub mit frischer Energie weiter zu unterstützen.
      </>
    ),
  },
]

/**
 * Homepage section shown instead of WeeklyActionSection during the
 * collective company holiday — see isCollectiveHolidayActive().
 */
export default function HolidayNotice() {
  return (
    <section id="holiday-notice" className="bg-[#0F1E46] text-white py-14 small:py-20">
      <div className="content-container">
        <div className="flex flex-col items-center text-center gap-3 mb-10 small:mb-14">
          <span className="inline-block bg-[#dc2626] text-white text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
            Betriebsferien 2026
          </span>
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl small:text-5xl leading-[0.95]">
            Wir machen Sommerurlaub
          </h2>
          <p className="text-white/60 text-sm">18.08. – 10.09.2026</p>
        </div>

        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <p className="font-heading font-bold text-white text-sm">
            Sehr geehrte Kundinnen und Kunden,
          </p>
          {ROWS.map((row, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                {row.icon}
              </div>
              <p className="text-sm leading-relaxed text-white/80 pt-1.5">{row.text}</p>
            </div>
          ))}
          <p className="text-sm leading-relaxed text-white/80">
            Mit freundlichen Grüßen
            <br />
            <strong className="text-white">Ihr Team von Planeta</strong>
          </p>
        </div>

        <div className="flex justify-center mt-10 small:mt-14">
          <LocalizedClientLink
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-white text-[#0F1E46] font-heading font-bold uppercase tracking-[0.12em] text-xs px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            Kontakt
            <span aria-hidden>→</span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
