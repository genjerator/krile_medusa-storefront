import { Metadata } from "next"
import LegalPage from "@modules/legal/components/legal-page"

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.",
}

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <section>
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          <br />
          Planeta Haushaltsgeräte GmbH &amp; Co. KG, Kornstr. 28, 87719
          Mindelheim, E-Mail:{" "}
          <a href="mailto:info@planeta.de">info@planeta.de</a>.
        </p>
      </section>

      <section>
        <h2>2. Allgemeines zur Datenverarbeitung</h2>
        <p>
          Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur,
          soweit dies zur Bereitstellung einer funktionsfähigen Website sowie
          unserer Inhalte und Leistungen erforderlich ist. Rechtsgrundlagen sind
          insbesondere Art. 6 Abs. 1 DSGVO.
        </p>
      </section>

      <section>
        <h2>3. Cookies und Einwilligung</h2>
        <p>
          Diese Website verwendet Cookies. Technisch notwendige Cookies werden zur
          Bereitstellung der Website eingesetzt. Cookies zu Statistik- und
          Analysezwecken (z. B. Google Analytics) werden ausschließlich nach Ihrer
          ausdrücklichen Einwilligung über unseren Cookie-Hinweis gesetzt (Art. 6
          Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Sie können Ihre Einwilligung
          jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
      </section>

      <section>
        <h2>4. Webanalyse (Google Analytics)</h2>
        <p>
          Sofern Sie eingewilligt haben, nutzen wir Google Analytics, einen Dienst
          der Google Ireland Limited, zur Analyse des Nutzungsverhaltens. Dabei
          werden u. a. gekürzte IP-Adressen verarbeitet. [Details zu
          Speicherdauer, Datenübermittlung in Drittländer und Auftragsverarbeitung
          ergänzen.]
        </p>
      </section>

      <section>
        <h2>5. Bestellungen und Vertragsabwicklung</h2>
        <p>
          Bei einer Bestellung verarbeiten wir die zur Vertragsabwicklung
          erforderlichen Daten (z. B. Name, Anschrift, Zahlungs- und
          Kontaktdaten) auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
        </p>
      </section>

      <section>
        <h2>6. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
          der Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Zudem steht
          Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu.
        </p>
      </section>

      <section>
        <h2>7. Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz erreichen Sie uns unter{" "}
          <a href="mailto:info@planeta.de">info@planeta.de</a>.
        </p>
      </section>
    </LegalPage>
  )
}
