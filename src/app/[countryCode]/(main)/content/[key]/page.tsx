import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getContentBlock } from "@lib/data/content-blocks"
import { descriptionToHtml } from "@lib/util/description-html"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ countryCode: string; key: string }>
}

// The URL's countryCode doubles as the language for this project (de/en/it).
const localeFromCountry = (countryCode: string) =>
  countryCode.slice(0, 2).toLowerCase()

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, key } = await props.params
  const block = await getContentBlock(key, localeFromCountry(countryCode))
  if (!block) return {}
  return { title: block.title || "Planeta Industries" }
}

/**
 * Renders a reusable content block by key, e.g. /de/content/about-hero.
 * Content is managed in the admin "Content Blocks" editor and stored as HTML.
 */
export default async function ContentBlockPage(props: Props) {
  const { countryCode, key } = await props.params
  const block = await getContentBlock(key, localeFromCountry(countryCode))

  if (!block || !block.body) notFound()

  return (
    <div className="content-container py-12">
      <div
        className="prose max-w-3xl mx-auto text-ui-fg-base [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:font-semibold [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-ui-border-base [&_th]:bg-ui-bg-subtle [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-ui-border-base [&_td]:px-3 [&_td]:py-2 [&_td]:align-top"
        dangerouslySetInnerHTML={{ __html: descriptionToHtml(block.body) }}
      />
    </div>
  )
}
