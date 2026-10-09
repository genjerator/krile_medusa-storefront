import Image from "next/image"

/**
 * Homepage section announcing our stand at the Oberschwabenschau 2026 in
 * Ravensburg (14.–18.10.2026) — see isOberschwabenschauActive(). Shown in
 * addition to the regular homepage sections (does not replace anything), only
 * while the event is being announced / running. Uses the fair's signature
 * green (#8fb140) and the official rooster ("Hahn") key visual.
 */
export default function OberschwabenschauNotice() {
  return (
    <section
      id="oberschwabenschau"
      className="relative overflow-hidden bg-[#8fb140] text-[#19260a]"
    >
      {/* soft decorative glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#6f8c2f]/40 blur-3xl" />

      <div className="content-container relative py-14 small:py-20">
        <div className="grid grid-cols-1 small:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-10 small:gap-14">
          {/* Rooster key visual */}
          <div className="order-2 small:order-1 flex justify-center">
            <a
              href="https://oberschwabenschau.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-[210px] small:w-[300px] aspect-[1499/2172] transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-2deg]"
              aria-label="Zur Oberschwabenschau Website"
            >
              <Image
                src="/oberschwabenschau-hahn.png"
                alt="Oberschwabenschau Ravensburg — Hahn Keyvisual"
                fill
                sizes="(max-width: 768px) 210px, 300px"
                className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)]"
                priority={false}
              />
            </a>
          </div>

          {/* Text content */}
          <div className="order-1 small:order-2 text-center small:text-left">
            <span className="inline-block bg-[#19260a] text-[#c7e06a] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              Oberschwabenschau 2026 · Ravensburg
            </span>

            <h2 className="mt-5 font-heading font-extrabold uppercase tracking-tight text-3xl small:text-5xl leading-[0.95]">
              Planeta ist dabei –<br />
              besuchen Sie uns!
            </h2>

            <div className="mt-6 flex flex-wrap justify-center small:justify-start gap-3">
              <span className="inline-flex items-center gap-2 bg-white text-[#19260a] text-base small:text-lg font-extrabold px-5 py-2 rounded-lg shadow-md">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                14. – 18. Oktober 2026
              </span>
              <span className="inline-flex items-center gap-2 bg-[#19260a]/10 text-[#19260a] text-base small:text-lg font-semibold px-5 py-2 rounded-lg">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7-5.686-7-11a7 7 0 0 1 14 0c0 5.314-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Oberschwabenhalle, Ravensburg
              </span>
            </div>

            <p className="mt-6 text-[#19260a]/80 text-sm small:text-base leading-relaxed max-w-xl mx-auto small:mx-0">
              Die Oberschwabenschau öffnet wieder ihre Tore in Ravensburg und
              Planeta ist mit dabei. Erleben Sie unsere Vakuumier und
              Küchengeräte live, lassen Sie sich beraten und entdecken Sie
              unsere Highlights vor Ort. Wir freuen uns auf Ihren Besuch an
              unserem Stand!
            </p>

            <a
              href="https://oberschwabenschau.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 bg-[#19260a] text-white text-sm font-semibold uppercase tracking-wide px-6 py-3 rounded-lg shadow-lg transition-colors hover:bg-black"
            >
              Mehr zur Oberschwabenschau
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
