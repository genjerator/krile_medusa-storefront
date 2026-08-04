import { Metadata } from "next"
import HeroV2 from "@modules/home/components/hero-v2"
import CategoryCards from "@modules/home/components/category-cards"
import Benefits from "@modules/home/components/benefits"
import FeaturedFour from "@modules/home/components/featured-four"
import FeaturedProducts from "@modules/home/components/featured-products"
import KemptenFestNotice from "@modules/home/components/kempten-fest-notice"
import HolidayNotice from "@modules/home/components/holiday-notice"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { isKemptenFestActive } from "@lib/util/kempten-fest"
import { isCollectiveHolidayActive } from "@lib/util/holiday"

export const metadata: Metadata = {
  title: "Vakuumverpackungsmaschinen für die Industrie",
  description: "Hochleistungs-Vakuumverpackungsmaschinen für Lebensmittel-, Pharma- und Industrieumgebungen. Modular, effizient, langlebig.",
  openGraph: {
    title: "Planeta Industries – Vakuumverpackungsmaschinen",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für Lebensmittel-, Pharma- und Industrieumgebungen. Modular, effizient, langlebig.",
    url: "/",
    images: [
      {
        url: "/planeta-og.jpg",
        width: 1200,
        height: 630,
        alt: "Planeta Industries – Vakuumverpackungsmaschinen",
      },
    ],
  },
  twitter: {
    title: "Planeta Industries – Vakuumverpackungsmaschinen",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion.",
    images: ["/planeta-og.jpg"],
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title" })

  if (!collections || !region) return null

  const isKemptenFest = isKemptenFestActive()
  const isHoliday = isCollectiveHolidayActive()

  return (
    <>
      <HeroV2
        showKemptenFestBanner={isKemptenFest}
        showHolidayBanner={isHoliday}
      />
      <CategoryCards />
      <Benefits />
      {isKemptenFest && <KemptenFestNotice />}
      {isHoliday && <HolidayNotice />}
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
