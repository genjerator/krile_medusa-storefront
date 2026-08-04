import Image from "next/image"

/**
 * Homepage section announcing our stand at the Kempten Festwoche 2026 —
 * see isKemptenFestActive(). Shown in addition to the regular homepage
 * sections (does not replace anything), only while the event is running.
 */
export default function KemptenFestNotice() {
  return (
    <section id="kempten-fest" className="bg-[#0F1E46] text-white py-14 small:py-20">
      <div className="content-container">
        <div className="flex flex-col items-center text-center gap-3 mb-10 small:mb-14">
          <span className="inline-block bg-[#dc2626] text-white text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full">
            Kempten Festwoche 2026
          </span>
          <h2 className="font-heading font-extrabold uppercase tracking-tight text-3xl small:text-5xl leading-[0.95]">
            Wir sind auf der Festwoche
          </h2>
          <p className="text-white/60 text-sm">31.07. – 18.08.2026</p>
        </div>

        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
          <a
            href="https://www.festwoche.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full aspect-[1240/1754] rounded-lg overflow-hidden shadow-lg border border-white/15"
          >
            <Image
              src="/kempten-festwoche-2026.jpg"
              alt="Kempten Festwoche 2026 — Plakat"
              fill
              sizes="(max-width: 768px) 90vw, 380px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </a>
          <p className="text-sm leading-relaxed text-white/80 text-center">
            Besuchen Sie uns auf der Kemptener Festwoche — wir freuen uns auf
            Ihren Besuch!
            <br />
            Wir sind auf der Allgäuer Festwoche in Kempten dieses Jahr auf dem
            Freigelände.
          </p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Standnummer
            </span>
            <span className="inline-block bg-[#dc2626] text-white text-2xl small:text-3xl font-extrabold tracking-wide px-5 py-2 rounded-lg shadow-lg">
              F. G. Nord 17
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
