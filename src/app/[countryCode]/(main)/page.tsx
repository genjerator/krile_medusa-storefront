import { Metadata } from "next"
import HeroV2 from "@modules/home/components/hero-v2"
import FeaturedFour from "@modules/home/components/featured-four"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "planeta industries",
  description: "Hochleistungs-Vakuumverpackungsmaschinen für Lebensmittel-, Pharma- und Industrieumgebungen. Modular, effizient, langlebig.",
  openGraph: {
    title: "planeta industries – Vakuumverpackungsmaschinen",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für Lebensmittel-, Pharma- und Industrieumgebungen. Modular, effizient, langlebig.",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "planeta industries – Vakuumverpackungsmaschinen",
      },
    ],
  },
  twitter: {
    title: "planeta industries – Vakuumverpackungsmaschinen",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion.",
    images: ["/p-series.webp"],
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title" })

  if (!collections || !region) return null

  return (
    <>
      <HeroV2 />
      <FeaturedFour />
      {collections.length > 0 && (
        <div className="py-12">
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )}
    </>
  )
}
