import { Metadata } from "next"
import HeroV2 from "@modules/home/components/hero-v2"
import FeaturedFour from "@modules/home/components/featured-four"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Home V2",
  description: "planeta industries",
}

export default async function Home2(props: {
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
