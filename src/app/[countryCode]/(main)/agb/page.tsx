import { Metadata } from "next"
import LegalPage from "@modules/legal/components/legal-page"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für Bestellungen im Online-Shop.",
}

export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <section>
        <h2>§ 1 Geltungsbereich</h2>
        <p>
          Für alle Bestellungen über unseren Online-Shop gelten die nachfolgenden
          Allgemeinen Geschäftsbedingungen (AGB) in der zum Zeitpunkt der
          Bestellung gültigen Fassung.
        </p>
      </section>

      <section>
        <h2>§ 2 Vertragspartner, Vertragsschluss</h2>
        <p>
          Der Kaufvertrag kommt zustande mit Planeta Haushaltsgeräte GmbH &amp;
          Co. KG. Die Darstellung der Produkte im Online-Shop stellt kein
          rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung
          dar. [Ablauf des Vertragsschlusses konkretisieren.]
        </p>
      </section>

      <section>
        <h2>§ 3 Preise und Versandkosten</h2>
        <p>
          Die angegebenen Preise enthalten die gesetzliche Mehrwertsteuer.
          Zuzüglich fallen ggf. Versandkosten an, die im Bestellprozess gesondert
          ausgewiesen werden.
        </p>
      </section>

      <section>
        <h2>§ 4 Lieferung</h2>
        <p>[Lieferbedingungen, Lieferzeiten und Liefergebiete ergänzen.]</p>
      </section>

      <section>
        <h2>§ 5 Zahlung</h2>
        <p>[Verfügbare Zahlungsarten und Zahlungsbedingungen ergänzen.]</p>
      </section>

      <section>
        <h2>§ 6 Eigentumsvorbehalt</h2>
        <p>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
      </section>

      <section>
        <h2>§ 7 Widerrufsrecht</h2>
        <p>
          Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Einzelheiten
          ergeben sich aus unserer{" "}
          <LocalizedClientLink href="/widerruf">Widerrufsbelehrung</LocalizedClientLink>.
        </p>
      </section>

      <section>
        <h2>§ 8 Gewährleistung</h2>
        <p>Es gelten die gesetzlichen Gewährleistungsrechte.</p>
      </section>
    </LegalPage>
  )
}
