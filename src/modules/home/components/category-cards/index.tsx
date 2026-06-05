import { getCategoryByHandle } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PINNED = [
  { handle: "packaging-machines" },
  { handle: "folien" },
  { handle: "vakuum-behaelter" },
  { handle: "gewurze" },
  { handle: "gebraucht_maschinen" },
]

const cardClass = "group relative rounded-xl overflow-hidden bg-gradient-to-br from-white to-slate-100 border border-blue-100 min-h-[380px] flex flex-col justify-between p-6 shadow-[0_6px_24px_rgba(15,30,70,0.10)] hover:border-blue-300 hover:shadow-[0_10px_36px_rgba(15,30,70,0.22)] hover:from-slate-50 hover:to-slate-200 transition-all duration-300"

function CardContent({ cat, found }: { cat: HttpTypes.StoreProductCategory | { handle: string; name: string }; found: boolean }) {
  const image = cat.handle ? `/pictogram-${cat.handle}.svg` : null
  const isPackaging = cat.handle === "packaging-machines"
  const subcategories = (cat as any).category_children ?? []

  return (
    <>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-px bg-slate-400" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-400">
            Kategorie
          </span>
        </div>

        <h3 className="text-xl font-bold leading-tight tracking-tight mb-3" style={{ color: "#0F1E46" }}>
          {(cat as any).name ?? cat.handle}
        </h3>

        {isPackaging && subcategories.length > 0 ? (
          <ul className="flex flex-col gap-1.5 mt-2">
            {subcategories
              .filter((sub: HttpTypes.StoreProductCategory) => sub.name !== (cat as any).name)
              .map((sub: HttpTypes.StoreProductCategory) => (
                <li key={sub.id} className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                  <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                  {sub.name}
                </li>
              ))}
          </ul>
        ) : (
          (cat as any).description && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
              {(cat as any).description}
            </p>
          )
        )}

        {image && (
          <div className="flex justify-center mt-6">
            <Image
              src={image}
              alt={(cat as any).name ?? cat.handle}
              width={200}
              height={200}
              className="object-contain opacity-30 group-hover:opacity-80 transition-opacity duration-300"
            />
          </div>
        )}
      </div>

      {found && (
        <div className="relative z-10 flex items-center gap-2 mt-6">
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-900 transition-colors tracking-wide uppercase">
            Entdecken
          </span>
          <svg
            className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  )
}

export default async function CategoryCards() {
  const [packagingMachines, folien, vakuumBehaelter, gewurze, gebrauchtMaschinen, haushalts] = await Promise.all([
    getCategoryByHandle(["packaging-machines"]).catch(() => null),
    getCategoryByHandle(["folien"]).catch(() => null),
    getCategoryByHandle(["vakuum-behaelter"]).catch(() => null),
    getCategoryByHandle(["gewurze"]).catch(() => null),
    getCategoryByHandle(["gebraucht_maschinen"]).catch(() => null),
    getCategoryByHandle(["haushalts-vakuumier-maschinen"]).catch(() => null),
  ])

  const slots = [
    { data: packagingMachines, handle: "packaging-machines" },
    { data: folien, handle: "folien" },
    { data: vakuumBehaelter, handle: "vakuum-behaelter" },
    { data: gewurze, handle: "gewurze" },
    { data: gebrauchtMaschinen, handle: "gebraucht_maschinen" },
    { data: haushalts, handle: "haushalts-vakuumier-maschinen" },
  ]

  return (
    <div className="content-container pt-6">
      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        {slots.map(({ data, handle }) => {
          const found = !!data
          const cat = data ?? { handle, name: handle }

          return found ? (
            <LocalizedClientLink
              key={handle}
              href={`/categories/${handle}`}
              className={cardClass}
            >
              <CardContent cat={cat as HttpTypes.StoreProductCategory} found={true} />
            </LocalizedClientLink>
          ) : (
            <div key={handle} className={cardClass}>
              <CardContent cat={cat as HttpTypes.StoreProductCategory} found={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
