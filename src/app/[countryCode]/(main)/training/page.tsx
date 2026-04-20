import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Training",
  description: "Training programs and resources.",
}

export default function TrainingPage() {
  return (
    <div className="content-container py-16">
      <h1 className="text-3xl font-semibold text-ui-fg-base mb-4">Training</h1>
      <div className="cmp-teaser__content">
        <h3 className="cmp-teaser__title">
          Willkommen im MULTIVAC Training Center!
        </h3>
        <div className="cmp-teaser__description">
          <h5>Unser Angebot</h5>
          <p><b>Kundenorientiertes Training</b></p>
          <p>für Bediener und für Wartungspersonal.</p>
          <p><b>Trainingsexperten</b></p>
          <p>
            Erfahrene Trainer vermitteln ihr fundiertes Wissen in unserem
            Schulungszentrum, welches mit modernster Schulungstechnik und einem
            umfangreichen Maschinenpark ausgestattet ist.
          </p>
          <p><b>Qualitativ hochwertige Weiterbildung für Ihre Mitarbeiter</b></p>
          <p>
            Sie wünschen sich reibungslose Abläufe, optimale Sicherheit und
            maximale Verfügbarkeit? Unser Trainingsangebot schafft durch die
            bestmögliche Kombination aus theoretischem Lerninhalt und praktischer
            Schulung die optimalen Voraussetzungen für gut ausgebildetes Personal.
          </p>
          <p><b>Modularer Trainingsaufbau</b></p>
          <p>
            Unser praxisnahes Kursangebot ist modular aufgebaut und kann einzeln
            oder fortlaufend nach entsprechenden Qualifikationsstufen gebucht werden.
          </p>
          <p><b>Weltweite Training-Center-Struktur</b></p>
          <p>
            In enger Zusammenarbeit mit den Schulungszentren der lokalen MULTIVAC
            Tochtergesellschaften stellen wir die hohe Qualität des internationalen
            MULTIVAC Trainings-Netzwerkes sicher.
          </p>
        </div>
      </div>
    </div>
  )
}
