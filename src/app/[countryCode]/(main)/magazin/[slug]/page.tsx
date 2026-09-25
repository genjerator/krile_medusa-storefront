import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { buildMetadata, SITE_NAME } from "@lib/util/metadata"
import { getBaseURL } from "@lib/util/env"
import { getArticle } from "@lib/data/articles"

export const revalidate = 300

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
  searchParams: Promise<{ krile?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const preview = (await props.searchParams)?.krile === "true"
  const article = await getArticle(countryCode, slug, { preview })
  if (!article) return { title: "Magazin" }
  return buildMetadata({
    title: article.meta_title || article.title || "Magazin",
    description: article.meta_description || article.excerpt || "",
    image: article.cover_image || undefined,
    path: `/magazin/${slug}`,
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

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

const CSS = `
.mvh{ background:#F2F5F3; color:#14181C; font-family:var(--font-inter),sans-serif; }
.mvh a{ color:#3B6B55; }
.mvh .mono{ font-family:var(--font-montserrat),sans-serif; letter-spacing:.04em; }
.mvh .channel{
  background-image:
    repeating-linear-gradient(60deg, rgba(20,24,28,.05) 0 1px, transparent 1px 9px),
    repeating-linear-gradient(-60deg, rgba(20,24,28,.05) 0 1px, transparent 1px 9px);
}
.mvh .topbar{ max-width:760px; margin:0 auto; padding:28px 24px 0; }
.mvh .back-link{ font-family:var(--font-montserrat),sans-serif; font-size:12.5px; text-decoration:none; color:#7C8890; display:inline-flex; align-items:center; gap:6px; }
.mvh .back-link:hover{ color:#14181C; }
.mvh .hero-wrap{ max-width:760px; margin:22px auto 0; padding:0 24px; }
.mvh .hero{ position:relative; background:#FBFCFB; border:1px solid #D9E0DD; border-radius:4px; padding:40px 34px 34px; }
.mvh .channel-strip{ position:absolute; inset:0; border-radius:4px; pointer-events:none; opacity:.5; }
.mvh .hero-inner{ position:relative; }
.mvh .eyebrow{ display:inline-flex; align-items:center; gap:8px; font-family:var(--font-montserrat),sans-serif; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:#B8402C; border:1px solid #B8402C; padding:4px 10px 4px 8px; border-radius:2px; }
.mvh .eyebrow .dot{ width:6px; height:6px; border-radius:50%; background:#B8402C; display:inline-block; }
.mvh h1{ font-family:var(--font-montserrat),sans-serif; font-weight:800; font-size:clamp(1.5rem,2.6vw,1.9rem); line-height:1.15; letter-spacing:-.01em; margin:16px 0 14px; color:#14181C; }
.mvh .dek{ font-size:1.18rem; line-height:1.55; color:#3B4650; margin:0 0 26px; max-width:52ch; }
.mvh .meta{ display:flex; align-items:center; flex-wrap:wrap; gap:12px; font-family:var(--font-montserrat),sans-serif; font-size:12px; color:#7C8890; padding-top:20px; border-top:1px solid #D9E0DD; }
.mvh .avatar{ width:30px; height:30px; border-radius:50%; background:#14181C; color:#fff; display:grid; place-items:center; font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:12px; }
.mvh .meta a{ color:#14181C; text-decoration:none; font-weight:600; }
.mvh .meta a:hover{ color:#3B6B55; }
.mvh .article{ max-width:700px; margin:0 auto; padding:0 24px 80px; }
.mvh .seal-bar{ display:flex; align-items:center; gap:14px; margin:56px 0 40px; height:14px; }
.mvh .seal-bar::before, .mvh .seal-bar::after{ content:""; flex:1; height:8px; background-image:repeating-linear-gradient(90deg,#7C8890 0 5px,transparent 5px 11px); background-position:center; opacity:.55; }
.mvh .body h2{ font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:1.35rem; letter-spacing:-.01em; color:#14181C; margin:0 0 14px; display:flex; align-items:baseline; gap:10px; }
.mvh .body h2::before{ content:""; width:18px; height:2px; background:#B8402C; display:inline-block; transform:translateY(-4px); }
.mvh .body h3{ font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:1.1rem; color:#14181C; margin:24px 0 9px; }
.mvh .body p{ font-size:1.06rem; line-height:1.8; color:#2B333A; margin:0 0 18px; }
.mvh .body strong{ color:#14181C; font-weight:600; }
.mvh .body a{ color:#3B6B55; text-decoration:underline; text-underline-offset:2px; }
.mvh .body ul, .mvh .body ol{ margin:0 0 20px; padding-left:0; list-style:none; display:flex; flex-direction:column; gap:12px; }
.mvh .body ul li{ position:relative; padding-left:26px; font-size:1.02rem; line-height:1.65; color:#2B333A; }
.mvh .body ul li::before{ content:""; position:absolute; left:0; top:.62em; width:12px; height:2px; background:#3B6B55; }
.mvh .body ol{ counter-reset:step; }
.mvh .body ol li{ position:relative; padding-left:30px; font-size:1.02rem; line-height:1.65; color:#2B333A; counter-increment:step; }
.mvh .body ol li::before{ content:counter(step,decimal-leading-zero); position:absolute; left:0; top:.15em; font-family:var(--font-montserrat),sans-serif; font-size:11px; color:#7C8890; }
.mvh .body blockquote{ background:#E9EEEA; border-left:3px solid #3B6B55; padding:16px 20px; border-radius:0 4px 4px 0; margin:28px 0; font-style:normal; font-size:.98rem; line-height:1.7; color:#293138; }
.mvh .body blockquote p{ margin:0; }
.mvh .cover{ max-width:760px; margin:26px auto 0; padding:0 24px; }
.mvh .cover img{ width:100%; height:auto; border:1px solid #D9E0DD; border-radius:4px; display:block; }
.mvh .plate-wrap{ max-width:700px; margin:34px auto 70px; padding:0 24px; }
.mvh .plate{ position:relative; background:#14181C; color:#EDEFEC; border-radius:4px; padding:26px; display:flex; align-items:center; gap:18px; }
.mvh .plate .screw{ position:absolute; width:5px; height:5px; border-radius:50%; background:#5B6670; }
.mvh .plate .s1{ top:10px; left:10px; } .mvh .plate .s2{ top:10px; right:10px; }
.mvh .plate .s3{ bottom:10px; left:10px; } .mvh .plate .s4{ bottom:10px; right:10px; }
.mvh .plate-avatar{ width:52px; height:52px; border-radius:50%; background:#3B6B55; color:#fff; display:grid; place-items:center; font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:17px; flex:none; }
.mvh .plate-label{ font-family:var(--font-montserrat),sans-serif; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:#9AA5AC; margin-bottom:4px; }
.mvh .plate .name{ font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:1.2rem; color:#fff; text-decoration:none; }
.mvh .plate .name:hover{ color:#3B6B55; }
.mvh .plate .plate-links{ margin-top:6px; font-family:var(--font-montserrat),sans-serif; font-size:11px; }
.mvh .plate .plate-links a{ color:#9AA5AC; text-decoration:none; }
.mvh .plate .plate-links a:hover{ color:#3B6B55; }
@media (max-width:560px){ .mvh .hero{ padding:30px 22px 26px; } }
`

export default async function ArticlePage(props: Props) {
  const { countryCode, slug } = await props.params
  const preview = (await props.searchParams)?.krile === "true"
  const article = await getArticle(countryCode, slug, { preview })
  if (!article) notFound()

  const base = getBaseURL()
  const url = `${base}/${countryCode}/magazin/${slug}`
  const date = formatDate(article.published_at, countryCode)
  const author = article.author
  const authorUrl = author ? `${base}/${countryCode}/magazin/autor/${author.slug}` : undefined
  const sameAs = author ? [author.linkedin_url, author.website_url, author.xing_url].filter(Boolean) : []

  // Insert a "seal-bar" divider before each section heading, matching the design.
  const bodyHtml = (article.body ?? "").replace(/<h2/g, '<div class="seal-bar"></div><h2')

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    ...(article.cover_image ? { image: [article.cover_image] } : {}),
    ...(article.published_at ? { datePublished: article.published_at, dateModified: article.published_at } : {}),
    author: author
      ? { "@type": "Person", name: author.name, url: authorUrl, ...(sameAs.length ? { sameAs } : {}) }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: url,
    ...(article.meta_description || article.excerpt ? { description: article.meta_description || article.excerpt } : {}),
  }

  const isDraftPreview = preview && article.status !== "published"

  return (
    <div className="mvh">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {isDraftPreview ? (
        <div
          style={{
            background: "#B8402C",
            color: "#fff",
            textAlign: "center",
            fontFamily: "var(--font-montserrat),sans-serif",
            fontSize: "12.5px",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            padding: "8px 16px",
          }}
        >
          Vorschau · unveröffentlichter Entwurf ({article.status ?? "draft"})
        </div>
      ) : null}

      <div className="topbar">
        <Link className="back-link" href={`/${countryCode}/magazin`}>← Magazin</Link>
      </div>

      <div className="hero-wrap">
        <div className="hero">
          <div className="channel-strip channel" />
          <div className="hero-inner">
            {article.category ? (
              <span className="eyebrow"><span className="dot" />{article.category}</span>
            ) : null}
            <h1>{article.title}</h1>
            {article.excerpt ? <p className="dek">{article.excerpt}</p> : null}
            <div className="meta">
              {author ? (
                <>
                  <span className="avatar">{initials(author.name)}</span>
                  <Link href={`/${countryCode}/magazin/autor/${author.slug}`}>{author.name}</Link>
                </>
              ) : null}
              {(author && date) ? <span>·</span> : null}
              {date ? <time dateTime={article.published_at ?? undefined}>{date}</time> : null}
              {author?.linkedin_url ? (
                <>
                  <span>·</span>
                  <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer nofollow">LinkedIn</a>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* cover_image is used only as a cover (listing card, og:image, JSON-LD) —
          intentionally NOT rendered on the article page itself. */}
      <div className="article">
        <div className="body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>
    </div>
  )
}
