import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktieren Sie uns.",
}

export default function KontaktPage() {
  return (
    <div className="content-container py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-ui-fg-base mb-4">Kontaktieren Sie uns</h1>
      <div className="flex flex-col gap-4 mb-10 text-ui-fg-subtle text-sm leading-relaxed">
        <p>
          Egal zu welchem Themengebiet Sie uns Fragen, Anmerkungen oder Kommentare hinterlassen möchten: Gerne werden unsere Mitarbeiter sich mit Ihnen in Kontakt setzen und Ihre Anfrage beantworten.
        </p>
        <div>
          <p className="font-semibold text-ui-fg-base mb-1">Wir sind für Sie da!</p>
          <p>
            Mit einer Verpackungslösung von MULTIVAC entscheiden Sie sich nicht nur für höchste Qualität und Effizienz, sondern auch für eine umfassende Betreuung und einen perfekten Service. Als eine weltweit agierende Unternehmensgruppe mit mehr als 80 Tochtergesellschaften sind wir eng mit unseren Kunden und Märkten vernetzt. Dies ermöglicht es uns, Marktentwicklungen und Trends sehr früh zu erkennen. Als unser Kunde profitieren Sie von unserem hochqualifizierten Sales- und Service-Team in Ihrer Nähe.
          </p>
        </div>
      </div>
      <div className="mb-10 flex flex-col gap-2 text-sm text-ui-fg-subtle">
        <div className="flex gap-2"><span className="text-ui-fg-base font-medium w-16">Tel:</span><span>+49 (0)8261 / 76233</span></div>
        <div className="flex gap-2"><span className="text-ui-fg-base font-medium w-16">Fax:</span><span>+49 (0)8261 / 76233</span></div>
        <div className="flex gap-2"><span className="text-ui-fg-base font-medium w-16">Email:</span><a href="mailto:info@planeta.de" className="hover:underline">info@planeta.de</a></div>
        <div className="flex gap-2"><span className="text-ui-fg-base font-medium w-16">Adresse:</span><a href="https://www.google.com/maps/search/?api=1&query=Kornstr.+28,+87719+Mindelheim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-navy font-medium hover:underline underline-offset-2">📍 Kornstr. 28, 87719 Mindelheim</a></div>
      </div>
      {/* <form className="flex flex-col gap-6">
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
      </form> */}
    </div>
  )
}
