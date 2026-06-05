"use client"

import { useState } from "react"
import { ReactNode } from "react"

type ServiceItem = {
  label: string
  href?: string
  target?: string
  content?: ReactNode
  children?: { label: string; href: string }[]
}

const ServiceKontakteContent = (
  <div className="pb-4 pl-4 border-l-2 border-brand-navy ml-1 flex flex-col gap-4 text-sm text-ui-fg-subtle">
    <p className="font-semibold text-ui-fg-base">Service Planeta</p>
    <div>
      <p>Tel.: <a href="tel:+49826176233" className="hover:text-brand-navy">+49 8261 / 76233</a></p>
    </div>
    <div>
      <p className="font-medium text-ui-fg-base mb-0.5">E-Mail</p>
      <a href="mailto:info@planeta.de" className="text-brand-navy hover:underline">
        info@planeta.de
      </a>
    </div>
    <div>
      <p className="font-medium text-ui-fg-base mb-1">Bürozeiten</p>
      <p>Montag – Donnerstag:</p>
      <p>07:00 – 17:00 Uhr*</p>
      <p className="mt-1">Freitag:</p>
      <p>07:00 – 15:00 Uhr*</p>
      <p className="mt-2 text-xs text-ui-fg-muted">*ausgenommen Feiertage in Bayern</p>
    </div>
  </div>
)

const SERVICE_ITEMS: ServiceItem[] = [
  { label: "Service Kontakte", content: ServiceKontakteContent },
  {
    label: "Training",
    content: (
      <div className="pb-4 pl-4 border-l-2 border-brand-navy ml-1 flex flex-col gap-4 text-sm text-ui-fg-subtle leading-relaxed">
        <p className="font-semibold text-ui-fg-base">Kundenorientiertes Training</p>
        <div className="flex flex-col gap-1">
          <p><span className="font-medium text-ui-fg-base">Zielgruppe:</span> Bediener und Wartungspersonal</p>
          <p><span className="font-medium text-ui-fg-base">Trainingsexperten:</span> Erfahrene Trainer vermitteln fundiertes Wissen in unserem Schulungszentrum, ausgestattet mit modernster Schulungstechnik und umfangreichem Maschinenpark</p>
        </div>
        <p className="font-semibold text-ui-fg-base">Qualitativ hochwertige Weiterbildung für Ihre Mitarbeiter</p>
        <div className="flex flex-col gap-2">
          <p><span className="font-medium text-ui-fg-base">Wunsch:</span> Reibungslose Abläufe, höchste Sicherheit und maximale Verfügbarkeit</p>
          <p><span className="font-medium text-ui-fg-base">Lösung:</span> Kombination aus theoretischem Lerninhalt und praxisnaher Schulung schafft die optimalen Voraussetzungen für gut ausgebildetes Personal</p>
        </div>
      </div>
    ),
  },
  {
    label: "Reparaturformular",
    content: (
      <div className="pb-4 pl-4 border-l-2 border-brand-navy ml-1">
        <a
          href="/Reparaturformular_fi.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-brand-navy hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
          </svg>
          Reparaturformular.pdf
        </a>
      </div>
    ),
  },
  {
    label: "Beratungsleistungen",
    children: [
      { label: "Ganzheitliche Verpackungsberatung", href: "#" },
      { label: "Verkaufsberatung", href: "#" },
      { label: "Serviceberatung", href: "#" },
      { label: "Wartungsberatung", href: "#" },

    ],
  },
]

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-4 h-4 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)

export default function ServiceList() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <ul className="flex flex-col divide-y divide-ui-border-base border-t border-b border-ui-border-base">
      {SERVICE_ITEMS.map((item) => (
        <li key={item.label}>
          {item.content || item.children ? (
            <>
              <button
                type="button"
                onClick={() => setOpen(open === item.label ? null : item.label)}
                className="w-full flex items-center justify-between py-4 text-ui-fg-base hover:text-brand-navy transition-colors group"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <ChevronIcon className={`text-ui-fg-muted group-hover:text-brand-navy transition-transform ${open === item.label ? "rotate-90" : ""}`} />
              </button>
              {open === item.label && (
                item.content ? (
                  item.content
                ) : (
                  <ul className="pb-3 flex flex-col gap-1 pl-4 border-l-2 border-brand-navy ml-1">
                    {item.children!.map((sub) => (
                      <li key={sub.label}>
                        <a
                          href={sub.href}
                          className="flex items-center gap-2 py-2 text-sm text-ui-fg-subtle hover:text-brand-navy transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </>
          ) : (
            <a
              href={item.href}
              target={item.target}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between py-4 text-ui-fg-base hover:text-brand-navy transition-colors group"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <ChevronIcon className="text-ui-fg-muted group-hover:text-brand-navy" />
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
