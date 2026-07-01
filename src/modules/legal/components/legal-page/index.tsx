import { ReactNode } from "react"

/**
 * Shared wrapper for the legal pages (Impressum, Datenschutz, AGB, Widerruf).
 * Content is placeholder boilerplate and MUST be reviewed/completed by the
 * client or a lawyer before going live.
 */
export default function LegalPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="content-container py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold text-ui-fg-base mb-6">{title}</h1>

      <div className="mb-8 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Platzhaltertext — dieser Rechtstext muss vor Veröffentlichung durch den
        Betreiber bzw. einen Rechtsanwalt geprüft und vervollständigt werden.
      </div>

      <div className="legal-content flex flex-col gap-6 text-sm text-ui-fg-subtle leading-relaxed [&_h2]:font-semibold [&_h2]:text-ui-fg-base [&_h2]:text-base [&_h2]:mt-4 [&_a]:text-brand-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80">
        {children}
      </div>
    </div>
  )
}
