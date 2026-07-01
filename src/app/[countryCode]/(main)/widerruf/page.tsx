import { Metadata } from "next"
import LegalPage from "@modules/legal/components/legal-page"

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Widerrufsrecht für Verbraucher und Muster-Widerrufsformular.",
}

export default function WiderrufPage() {
  return (
    <LegalPage title="Widerrufsbelehrung">
      <section>
        <h2>Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab
          dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der
          Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Planeta Haushaltsgeräte
          GmbH &amp; Co. KG, Kornstr. 28, 87719 Mindelheim, E-Mail:{" "}
          <a href="mailto:info@planeta.de">info@planeta.de</a>) mittels einer
          eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine
          E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
          über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
          absenden.
        </p>
      </section>

      <section>
        <h2>Folgen des Widerrufs</h2>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die
          wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit
          Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine
          andere Art der Lieferung als die von uns angebotene, günstigste
          Standardlieferung gewählt haben), unverzüglich und spätestens binnen
          vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
          Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
        </p>
        <p>
          [Bedingungen zur Rücksendung der Ware und zur Tragung der
          Rücksendekosten ergänzen.]
        </p>
      </section>

      <section>
        <h2>Muster-Widerrufsformular</h2>
        <p>
          (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
          Formular aus und senden Sie es zurück.)
        </p>
        <p>
          — An Planeta Haushaltsgeräte GmbH &amp; Co. KG, Kornstr. 28, 87719
          Mindelheim, <a href="mailto:info@planeta.de">info@planeta.de</a>:
          <br />
          — Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
          Vertrag über den Kauf der folgenden Waren (*)
          <br />
          — Bestellt am (*) / erhalten am (*)
          <br />
          — Name des/der Verbraucher(s)
          <br />
          — Anschrift des/der Verbraucher(s)
          <br />
          — Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
          <br />
          — Datum
          <br />
          (*) Unzutreffendes streichen.
        </p>
      </section>
    </LegalPage>
  )
}
