import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { buildMetadata, SITE_NAME } from "@lib/util/metadata"
import { getBaseURL } from "@lib/util/env"
import { getArticleAuthor } from "@lib/data/articles"

export const revalidate = 300

type Props = { params: Promise<{ countryCode: string; slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const data = await getArticleAuthor(countryCode, slug)
  if (!data) return { title: "Magazin" }
  const { author } = data
  return buildMetadata({
    title: author.name,
    description: author.bio || `Artikel von ${author.name} im ${SITE_NAME} Magazin.`,
    image: author.photo_url || undefined,
    path: `/magazin/autor/${slug}`,
    locale: countryCode,
  })
}

function formatDate(iso: string | null, locale: string) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })
  } catch {
    return null
  }
}

export default async function AuthorPage(props: Props) {
  const { countryCode, slug } = await props.params
  const data = await getArticleAuthor(countryCode, slug)
  if (!data) notFound()
  const { author, articles } = data

  const base = getBaseURL()
  const sameAs = [author.linkedin_url, author.website_url, author.xing_url].filter(Boolean)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.photo_url ? { image: author.photo_url } : {}),
    url: `${base}/${countryCode}/magazin/autor/${slug}`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(author.bio ? { description: author.bio } : {}),
  }

  return (
    <div className="content-container py-12 small:py-16 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-sm">
        <Link href={`/${countryCode}/magazin`} className="text-ui-fg-subtle hover:text-ui-fg-base">← Magazin</Link>
      </nav>

      <header className="flex items-start gap-5">
        {author.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={author.photo_url} alt={author.name} className="w-20 h-20 rounded-full object-cover" />
        ) : null}
        <div>
          <h1 className="heading-product text-ui-fg-base">{author.name}</h1>
          {author.role ? <p className="text-ui-fg-subtle">{author.role}</p> : null}
          <div className="mt-2 flex gap-4 text-sm">
            {author.linkedin_url ? (
              <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer nofollow" className="text-ui-fg-interactive hover:underline">LinkedIn</a>
            ) : null}
            {author.website_url ? (
              <a href={author.website_url} target="_blank" rel="noopener noreferrer nofollow" className="text-ui-fg-interactive hover:underline">Website</a>
            ) : null}
            {author.xing_url ? (
              <a href={author.xing_url} target="_blank" rel="noopener noreferrer nofollow" className="text-ui-fg-interactive hover:underline">Xing</a>
            ) : null}
          </div>
        </div>
      </header>

      {author.bio ? (
        <div
          className="mt-6 text-base leading-relaxed text-ui-fg-subtle [&>p]:my-4 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ui-fg-base [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: author.bio }}
        />
      ) : null}

      <h2 className="heading-section text-ui-fg-base mt-12 mb-5 !text-xl">Artikel</h2>
      {articles.length === 0 ? (
        <p className="text-ui-fg-muted">Noch keine Artikel.</p>
      ) : (
        <ul className="divide-y divide-ui-border-base">
          {articles.map((a) => {
            const date = formatDate(a.published_at, countryCode)
            return (
              <li key={a.id} className="py-4">
                <Link href={`/${countryCode}/magazin/${a.slug}`} className="group flex flex-col gap-1">
                  <span className="text-base font-medium text-ui-fg-base group-hover:text-ui-fg-interactive">{a.title}</span>
                  {a.excerpt ? <span className="text-sm text-ui-fg-subtle line-clamp-2">{a.excerpt}</span> : null}
                  {date ? <span className="text-xs text-ui-fg-muted">{date}</span> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
