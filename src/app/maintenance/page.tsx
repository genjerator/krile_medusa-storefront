import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website im Aufbau",
  description: "Unsere Website befindet sich derzeit im Aufbau.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
      <div className="max-w-lg flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-brand-navy/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-brand-navy"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-brand-navy tracking-tight">
          Website im Aufbau
        </h1>

        <p className="text-ui-fg-subtle leading-relaxed">
          Wir arbeiten gerade an unserer Website und sind in Kürze wieder für Sie
          da. Vielen Dank für Ihr Verständnis.
        </p>

        <div className="pt-2 text-sm text-ui-fg-muted">
          Bei Fragen erreichen Sie uns unter{" "}
          <a
            href="mailto:info@planeta.de"
            className="text-brand-navy font-medium underline underline-offset-2 hover:opacity-80"
          >
            info@planeta.de
          </a>
        </div>
      </div>
    </div>
  )
}
