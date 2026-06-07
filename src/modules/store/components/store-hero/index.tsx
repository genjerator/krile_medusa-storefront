import { ReactNode } from "react"

export default function StoreHero({ children }: { children?: ReactNode }) {
  return (
    <div className="bg-brand-navy text-white py-6 medium:py-10 pt-0">
      <div className="content-container">
        <h1 className="text-2xl medium:text-4xl font-bold mb-1 medium:mb-3">Produkte</h1>
        <p className="text-white/70 text-sm leading-relaxed">
          Entdecken Sie unsere hochwertigen Vakuumverpackungsmaschinen
          für professionelle Anwendungen.
        </p>
        {children}
      </div>
    </div>
  )
}
