import { getCategoryByHandle } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PINNED = [
  { handle: "vakuum-maschinen" },
  { handle: "vakuumspeicherung" },
  { handle: "vakuum-behaelter" },
  { handle: "gewurze" },
  { handle: "gebraucht_maschinen" },
]

const cardClass = "group relative rounded-xl overflow-hidden bg-gradient-to-br from-white to-slate-100 border border-blue-100 min-h-[160px] flex flex-col justify-between p-4 shadow-[0_6px_24px_rgba(15,30,70,0.10)] hover:border-blue-300 hover:shadow-[0_10px_36px_rgba(15,30,70,0.22)] hover:from-slate-50 hover:to-slate-200 transition-all duration-300"

function CardContent({ cat }: { cat: HttpTypes.StoreProductCategory | { handle: string; name: string } }) {
  const image = cat.handle ? `/pictogram-${cat.handle}.svg` : null
  const isPackaging = cat.handle === "vakuum-maschinen"
  const subcategories = (cat as any).category_children ?? []

  return (
    <>
      <div className="relative z-10">
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

      </div>

      {image && (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <Image
            src={image}
            alt=""
            aria-hidden
            width={130}
            height={130}
            className="object-contain opacity-10 group-hover:opacity-25 transition-opacity duration-300"
          />
        </div>
      )}
    </>
  )
}

export default async function CategoryCards() {
  const [packagingMachines, folien, vakuumBehaelter, gewurze, gebrauchtMaschinen, haushalts] = await Promise.all([
    getCategoryByHandle(["vakuum-maschinen"]).catch(() => null),
    getCategoryByHandle(["vakuumiertuten-rollen"]).catch(() => null),
    getCategoryByHandle(["vakuum-behaelter"]).catch(() => null),
    getCategoryByHandle(["gewurze"]).catch(() => null),
    getCategoryByHandle(["gebraucht_maschinen"]).catch(() => null),
    getCategoryByHandle(["haushalts-vakuumier-maschinen"]).catch(() => null),
  ])

  const slots: { data: HttpTypes.StoreProductCategory | null | undefined; handle: string; name?: string }[] = [
    { data: packagingMachines, handle: "vakuum-maschinen", name: "Vakuum Maschinen" },
    { data: folien, handle: "vakuumiertuten-rollen", name: "Vakuumiertüten & Rollen" },
    { data: vakuumBehaelter, handle: "vakuum-behaelter" },
    { data: gewurze, handle: "gewurze" },
    { data: gebrauchtMaschinen, handle: "gebraucht_maschinen" },
    { data: haushalts, handle: "haushalts-vakuumier-maschinen" },
  ]

  return (
    <div className="content-container pt-6">
      <div className="grid grid-cols-1 small:grid-cols-3 auto-rows-fr gap-4">
        {slots.map(({ data, handle, name }) => {
          const found = !!data
          const cat = { ...(data ?? {}), handle, name: name ?? data?.name ?? handle }

          return found ? (
            <LocalizedClientLink
              key={handle}
              href={`/categories/${handle}`}
              className={cardClass}
            >
              <CardContent cat={cat as HttpTypes.StoreProductCategory} />
            </LocalizedClientLink>
          ) : (
            <div key={handle} className={cardClass}>
              <CardContent cat={cat as HttpTypes.StoreProductCategory} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
