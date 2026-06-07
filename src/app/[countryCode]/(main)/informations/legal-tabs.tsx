"use client"

import { useState } from "react"

const TABS = [
  {
    id: "agb",
    label: "AGB",
    content: (
      <div className="flex flex-col gap-6 text-sm text-ui-fg-subtle leading-relaxed">
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 1 Geltungsbereich, Kundeninformationen</h3>
          <p>Die folgenden allgemeinen Geschäftsbedingungen regeln das Vertragsverhältnis zwischen Kristian Tirkajla, Planetex (info@planetex.de) und den Verbrauchern und Unternehmern, die über unseren Shop Waren kaufen. Entgegenstehende oder von unseren Geschäftsbedingungen abweichende Bedingungen werden von uns nicht anerkannt. Die Vertragssprache ist Deutsch.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 2 Vertragsschluss</h3>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Die Angebote im Internet stellen eine unverbindliche Aufforderung an Sie dar, Waren zu kaufen.</li>
            <li>Nach Eingabe Ihrer Daten und mit dem Anklicken des Bestellbuttons geben Sie ein verbindliches Angebot auf Abschluss eines Kaufvertrags ab. Sie können eine verbindliche Bestellung aber auch telefonisch oder per Telefax abgeben.</li>
            <li>Mit der unverzüglich per E-Mail bzw. Telefax versandten Zugangsbestätigung wird gleichzeitig auch die Annahme Ihres Angebots erklärt und der Kaufvertrag damit abgeschlossen. Bei einer telefonischen Bestellung kommt der Kaufvertrag zustande, wenn wir Ihr Angebot sofort annehmen. Wird das Angebot nicht sofort angenommen, dann sind Sie auch nicht mehr daran gebunden.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 3 Kundeninformation: Speicherung Ihrer Bestelldaten</h3>
          <p>Ihre Bestellung mit Einzelheiten zum geschlossenen Vertrag (z.B. Art des Produkts, Preis etc.) wird von uns gespeichert. Die AGB schicken wir Ihnen zu, Sie können die AGB aber auch nach Vertragsschluss jederzeit über unsere Webseite aufrufen.</p>
          <p className="mt-2">Als registrierter Kunde können Sie auf Ihre vergangenen Bestellungen über den Kunden LogIn-Bereich (Mein Konto) zugreifen.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 4 Kundeninformation: Korrekturhinweis</h3>
          <p>Sie können Ihre Eingaben vor Abgabe der Bestellung jederzeit mit der Löschtaste berichtigen. Wir informieren Sie auf dem Weg durch den Bestellprozess über weitere Korrekturmöglichkeiten. Den Bestellprozess können Sie auch jederzeit durch Schließen des Browser-Fensters komplett beenden.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 5 Rücksendekosten im Fall des Widerrufs</h3>
          <p>Sie haben im Fall des Widerrufs die Kosten der Rücksendung zu tragen, wenn die gelieferte Ware der bestellten entspricht und wenn der Preis der zurückzusendenden Sache einen Betrag von 40,- Euro nicht übersteigt oder wenn Sie bei einem höheren Preis der Sache zum Zeitpunkt des Widerrufs noch nicht die Gegenleistung oder eine vertraglich vereinbarte Teilzahlung erbracht haben. Sie müssen auch nur die regelmäßigen Kosten der Rücksendung tragen. Mehrkosten, die z.B. durch eine Änderung unseres Geschäftssitzes oder durch den von uns gewünschten Einsatz teurer Transportdienste entstehen, gehen zu unseren Lasten.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 6 Eigentumsvorbehalt</h3>
          <p>Der Kaufgegenstand bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 7 Gewährleistung</h3>
          <p>Die Gewährleistung richtet sich nach den gesetzlichen Vorschriften.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 8 Haftungsbeschränkung</h3>
          <p>Wir schließen die Haftung für leicht fahrlässige Pflichtverletzungen aus, sofern diese keine vertragswesentlichen Pflichten, Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, Garantien oder Ansprüche nach dem Produkthaftungsgesetz betreffen. Gleiches gilt für Pflichtverletzungen unserer Erfüllungsgehilfen und unserer gesetzlichen Vertreter. Zu den vertragswesentlichen Pflichten gehört insbesondere die Pflicht, Ihnen die Sache zu übergeben und Ihnen das Eigentum daran zu verschaffen. Weiterhin haben wir Ihnen die Sache frei von Sach- und Rechtsmängeln zu verschaffen.</p>
        </div>
      </div>
    ),
  },
  {
    id: "datenschutz",
    label: "Datenschutz",
    content: (
      <div className="flex flex-col gap-6 text-sm text-ui-fg-subtle leading-relaxed">
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 1 Allgemeines</h3>
          <p>Ihre personenbezogenen Daten (z.B. Anrede, Name, Anschrift, E-Mail-Adresse, Telefonnummer, Bankverbindung, Kreditkartennummer) werden von uns nur gemäß den Bestimmungen des deutschen Datenschutzrechts verarbeitet. Die nachfolgenden Vorschriften informieren Sie über Art, Umfang und Zweck der Erhebung, Verarbeitung und Nutzung personenbezogener Daten. Diese Datenschutzerklärung bezieht sich nur auf unsere Webseiten. Falls Sie über Links auf unseren Seiten auf andere Seiten weitergeleitet werden, informieren Sie sich bitte dort über den jeweiligen Umgang mit Ihren Daten.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 2 Bestandsdaten</h3>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Ihre personenbezogenen Daten, soweit diese für die Begründung, inhaltliche Ausgestaltung oder Änderung des Vertragsverhältnisses erforderlich sind (Bestandsdaten), werden ausschließlich zur Vertragsabwicklung verwendet. So muss z.B. zur Zustellung der Waren Ihr Name und Ihre Anschrift an den Warenlieferanten weitergegeben werden.</li>
            <li>Ohne Ihre ausdrückliche Einwilligung oder ohne gesetzliche Grundlage werden Ihre personenbezogenen Daten nicht an außerhalb der Vertragsabwicklung stehende Dritte weitergegeben. Nach vollständiger Vertragsabwicklung werden Ihre Daten für die weitere Verwendung gesperrt. Nach Ablauf der steuer- und handelsrechtlichen Vorschriften werden diese Daten gelöscht, sofern Sie nicht ausdrücklich in die weitere Nutzung eingewilligt haben.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 3 Bonitätsprüfung (Kauf-auf-Rechnung mit Billsafe)</h3>
          <p className="mb-2">Um Ihnen möglichst gute Optionen für die Wahl der Zahlungsart anbieten zu können, müssen wir Sie und uns vor Missbrauch schützen. Daher arbeiten wir mit BILLSAFE zusammen. BILLSAFE übermittelt Ihre Daten an Wirtschaftsauskunfteien, um eine Bonitätsauskunft zur Einschätzung des Haftungsrisikos zu erhalten. Sonst erfolgt keine Weitergabe Ihrer Daten an Dritte. In Ausnahmefällen kann BILLSAFE jedoch gesetzlich verpflichtet sein, auf Anfrage bestimmten öffentlichen Stellen Auskunft zu erteilen. Dies sind Strafverfolgungsbehörden, Behörden, die bußgeldbewährte Ordnungswidrigkeiten verfolgen und die Finanzbehörden. Weiterhin haben bestimmte Verbraucher- und Wettbewerbsschutzverbände einen gesetzlichen Anspruch auf Datenherausgabe. Eine Datenherausgabe erfolgt jedoch nur nach sorgfältiger Prüfung durch BillSAFE.</p>
          <p>Einer Übermittlung Ihrer Daten an BILLSAFE können Sie jederzeit widersprechen. Eine Mitteilung in Textform (z.B. E-Mail, Fax, Brief) reicht hierfür aus. Wir weisen jedoch darauf hin, dass Ihnen in diesem Fall nur noch die Zahlarten Vorkasse und PayPal zur Verfügung stehen.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 4 Webanalyse mit Google Analytics</h3>
          <p>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. („Google"). Google Analytics verwendet sog."Cookies", Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Im Falle der Aktivierung der IP-Anonymisierung auf dieser Webseite, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem Sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren:{" "}<a href="http://tools.google.com/dlpage/gaoptout?hl=de" target="_blank" rel="noopener noreferrer" className="text-brand-navy hover:underline">http://tools.google.com/dlpage/gaoptout?hl=de</a></p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 5 Informationen über Cookies</h3>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Zur Optimierung unseres Internetauftritts setzen wir Cookies ein. Es handelt sich dabei um kleine Textdateien, die im Arbeitsspeicher Ihres Computers gespeichert werden. Diese Cookies werden nach dem Schließen des Browsers wieder gelöscht. Andere Cookies verbleiben auf Ihrem Rechner (Langzeit-Cookies) und erkennen ihn beim nächsten Besuch wieder. Dadurch können wir Ihnen einen besseren Zugang auf unsere Seite ermöglichen.</li>
            <li>Das Speichern von Cookies können Sie verhindern, indem Sie in Ihren Browser-Einstellungen „Cookies blockieren" wählen. Dies kann aber eine Funktionseinschränkung unserer Angebote zur Folge haben.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">§ 6 Auskunft</h3>
          <p>Nach dem Bundesdatenschutzgesetz haben Sie ein Recht auf unentgeltliche Auskunft über Ihre gespeicherten Daten sowie ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Fragen können Sie z.B. über die folgende E-Mail-Adresse stellen:{" "}<a href="mailto:info@planetex.de" className="text-brand-navy hover:underline">info@planetex.de</a></p>
        </div>
      </div>
    ),
  },
  {
    id: "impressum",
    label: "Impressum",
    content: (
      <div className="flex flex-col gap-6 text-sm text-ui-fg-subtle leading-relaxed">
        <div>
          <p className="text-ui-fg-muted mb-3">Angaben gemäß § 5 TMG:</p>
          <p>
            <strong className="text-ui-fg-base">Planeta Haushaltsgeräte GmbH &amp; Co. KG</strong><br />
            Kornstr. 28<br />
            87719 Mindelheim
          </p>
        </div>
        <div>
          <p className="font-semibold text-ui-fg-base mb-1">Vertreten durch den Inhaber/Geschäftsführer:</p>
          <p>Kristian Tirkajla</p>
        </div>
        <div>
          <p className="font-semibold text-ui-fg-base mb-1">Kontakt:</p>
          <p>
            Telefon: +49 (0) 8261 76 – 233<br />
            Telefax: +49 (0) 8261 7623-49<br />
            E-Mail: <a href="mailto:info@planeta-shop.de" className="text-brand-navy hover:underline">info@planeta-shop.de</a>
          </p>
        </div>
        <div>
          <p className="font-semibold text-ui-fg-base mb-1">Registereintrag:</p>
          <p>
            Eintragung im Handelsregister.<br />
            Registergericht: Memmingen<br />
            Registernummer: HRB16730
          </p>
        </div>
        <div>
          <p className="font-semibold text-ui-fg-base mb-1">Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:</p>
          <p>DE307925760</p>
        </div>
        <div>
          <p className="font-semibold text-ui-fg-base mb-1">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</p>
          <p>
            Kristian Tirkajla<br />
            Kornstr. 28<br />
            87719 Mindelheim
          </p>
        </div>
        <div>
          <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}<a href="http://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-navy hover:underline">http://ec.europa.eu/consumers/odr</a></p>
          <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">Haftung für Inhalte</h3>
          <p>Als Dienstanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">Haftung für Links</h3>
          <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">Urheberrecht</h3>
          <p className="mb-2">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
          <p className="mb-2">Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
          <p>Quelle: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="text-brand-navy hover:underline">https://www.e-recht24.de</a></p>
        </div>
      </div>
    ),
  },
  {
    id: "widerrufsrecht",
    label: "Widerrufsrecht",
    content: (
      <div className="flex flex-col gap-6 text-sm text-ui-fg-subtle leading-relaxed">
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">Widerrufsrecht</h3>
          <p className="mb-2">Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
          <p className="mb-2">Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.</p>
          <p className="mb-2">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Planetex, Kristian Tirkajla, Kornstr. 28, D-87719 Mindelheim, Telefon: +49 (0) 8261 76233, Telefax: +49 (0) 8261 7623-49, E-Mail: <a href="mailto:info@planetex.de" className="text-brand-navy hover:underline">info@planetex.de</a>) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
          <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">Folgen des Widerrufs</h3>
          <p className="mb-2">Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist. Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.</p>
          <p className="mb-2">Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>
          <p>Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-ui-fg-base mb-2">Ausschluss des Widerrufsrechts</h3>
          <p>Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind.</p>
        </div>
        <div className="border border-ui-border-base rounded-md p-5 bg-ui-bg-subtle">
          <h3 className="text-base font-semibold text-ui-fg-base mb-3">MUSTER-WIDERRUFSFORMULAR</h3>
          <p className="mb-4 text-ui-fg-muted">(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
          <p className="font-semibold text-ui-fg-base mb-2">An</p>
          <p className="mb-4">
            Kristian Tirkajla<br />
            Planetex<br />
            Kornstr. 28<br />
            D-87719 Mindelheim<br />
            Telefon: +49 (0) 8261 76233<br />
            Telefax: +49 (0) 8261 7623-49<br />
            E-Mail: <a href="mailto:info@planetex.de" className="text-brand-navy hover:underline">info@planetex.de</a>
          </p>
          <p className="mb-3">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*)</p>
          <div className="flex flex-col gap-3 font-sans text-xs text-ui-fg-base">
            <div className="border-b border-ui-border-base pb-1">_______________________________________________</div>
            <div className="border-b border-ui-border-base pb-1">_______________________________________________</div>
            <p className="not-italic text-sm">Bestellt am ___________________ (*) / erhalten am ___________________ (*)</p>
            <p className="not-italic text-sm">Name des/der Verbraucher(s) ______________________________________</p>
            <p className="not-italic text-sm">Anschrift des/der Verbraucher(s)</p>
            <div className="border-b border-ui-border-base pb-1">_________________________________</div>
            <div className="border-b border-ui-border-base pb-1">_________________________________</div>
            <div className="border-b border-ui-border-base pb-1">_________________________________</div>
            <div className="flex gap-8 mt-2">
              <div className="flex-1 border-b border-ui-border-base pb-1">_____________________</div>
              <div className="flex-1 border-b border-ui-border-base pb-1">_____________________</div>
            </div>
            <div className="flex gap-8 text-ui-fg-muted not-italic text-xs">
              <div className="flex-1">Datum</div>
              <div className="flex-1">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</div>
            </div>
          </div>
          <p className="mt-4 text-ui-fg-muted">(*) Unzutreffendes streichen</p>
        </div>
      </div>
    ),
  },
]

export default function LegalTabs() {
  const [active, setActive] = useState("agb")
  const current = TABS.find((t) => t.id === active)!

  return (
    <div className="mt-12">
      <div className="flex border-b border-ui-border-base">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 font-heading font-semibold uppercase tracking-widest text-xs transition-colors border-b-2 -mb-px
              ${active === tab.id
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-ui-fg-muted hover:text-ui-fg-base"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{current.content}</div>
    </div>
  )
}
