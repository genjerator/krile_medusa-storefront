type Benefit = { title: string; text: string }

const BENEFITS: Benefit[] = [
  {
    title: "Persönliche Betreuung mit direkter Ansprechperson",
    text: "Bedarfsanalyse, Maschinenauswahl, Installation, Schulung und fortlaufender Support",
  },
  {
    title: "Zeit- und Arbeitsersparnis",
    text: "Schnelle und effiziente Verpackungsprozesse für Lebensmittel und andere Produkte",
  },
  {
    title: "Frische, Hygiene und Produktschutz",
    text: "Sichere Vakuumverpackung für längere Haltbarkeit und optimale Produktqualität",
  },
  {
    title: "Platz- und Kostenersparnis",
    text: "Kompakte, energieeffiziente und wartungsarme Vakuummaschinen",
  },
  {
    title: "Langlebigkeit und Zuverlässigkeit",
    text: "Robuste Industriequalität mit über 80 Jahren Erfahrung",
  },
  {
    title: "Umweltbewusstes Arbeiten",
    text: "Weniger Lebensmittelverschwendung durch längere Haltbarkeit und effizienter Materialeinsatz",
  },
  {
    title: "Rundum-Service",
    text: "Beratung, Installation, Inbetriebnahme, Wartung und Schulung",
  },
]

export default function Benefits() {
  return (
    <section className="content-container py-6">
      <ul className="grid grid-cols-1 small:grid-cols-2 gap-x-8 gap-y-5">
        {BENEFITS.map((b) => (
          <li key={b.title} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <div>
              <span className="font-semibold" style={{ color: "#0F1E46" }}>
                {b.title}:
              </span>{" "}
              <span className="text-slate-500">{b.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
