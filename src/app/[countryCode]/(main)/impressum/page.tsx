import { Metadata } from "next"
import LegalPage from "@modules/legal/components/legal-page"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung.",
}

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <section>
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          Planeta Haushaltsgeräte GmbH &amp; Co. KG
          <br />
          Kornstr. 28
          <br />
          87719 Mindelheim
          <br />
          Deutschland
        </p>
      </section>

      <section>
        <h2>Vertreten durch</h2>
        <p>[Geschäftsführer / vertretungsberechtigte Person]</p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: +49 (0)8261 / 76233
          <br />
          E-Mail: <a href="mailto:info@planeta.de">info@planeta.de</a>
        </p>
      </section>

      <section>
        <h2>Registereintrag</h2>
        <p>
          Eintragung im Handelsregister.
          <br />
          Registergericht: [Amtsgericht …]
          <br />
          Registernummer: [HRA/HRB …]
        </p>
      </section>

      <section>
        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          [DE …]
        </p>
      </section>

      <section>
        <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </LegalPage>
  )
}
