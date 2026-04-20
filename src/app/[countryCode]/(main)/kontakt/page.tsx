import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie uns.",
}

export default function KontaktPage() {
  return (
    <div className="content-container py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-ui-fg-base mb-8">Kontakt</h1>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ui-fg-base" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ihr Name"
            className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ui-fg-base" htmlFor="email">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="ihre@email.de"
            className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ui-fg-base" htmlFor="message">
            Nachricht
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Ihre Nachricht..."
            className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive resize-none"
          />
        </div>
        <button
          type="submit"
          className="self-start bg-brand-navy text-white text-sm px-6 py-2 rounded-base hover:opacity-80 transition-opacity"
        >
          Absenden
        </button>
      </form>
    </div>
  )
}
