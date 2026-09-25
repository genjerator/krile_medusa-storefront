import { Metadata } from "next"
import Link from "next/link"
import { buildMetadata } from "@lib/util/metadata"
import { listArticles, type ArticleCard } from "@lib/data/articles"

export const revalidate = 300

type Props = { params: Promise<{ countryCode: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params
  return buildMetadata({
    title: "Magazin",
    description:
      "Ratgeber, Tipps und Neuigkeiten rund um Vakuumtechnik, Verpackung und Ausrüstung – das Planeta Industries Magazin.",
    path: "/magazin",
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
.mvh .channel{ background-image:
  repeating-linear-gradient(60deg, rgba(20,24,28,.05) 0 1px, transparent 1px 9px),
  repeating-linear-gradient(-60deg, rgba(20,24,28,.05) 0 1px, transparent 1px 9px); }
.mi-wrap{ max-width:1140px; margin:0 auto; padding:48px 24px 90px; }
.mi-eyebrow{ display:inline-block; font-family:var(--font-montserrat),sans-serif; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:#B8402C; border:1px solid #B8402C; padding:4px 10px; border-radius:2px; }
.mi-title{ font-family:var(--font-montserrat),sans-serif; font-weight:800; font-size:clamp(1.7rem,3vw,2.3rem); letter-spacing:-.01em; color:#14181C; margin:16px 0 8px; }
.mi-sub{ color:#3B4650; max-width:56ch; font-size:1.05rem; line-height:1.55; margin:0; }
.mi-rule{ display:flex; align-items:center; gap:14px; margin:26px 0 30px; height:8px; }
.mi-rule::before, .mi-rule::after{ content:""; flex:1; height:8px; background-image:repeating-linear-gradient(90deg,#7C8890 0 5px,transparent 5px 11px); background-position:center; opacity:.5; }
.mi-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.mi-card{ display:flex; flex-direction:column; background:#FBFCFB; border:1px solid #D9E0DD; border-radius:4px; overflow:hidden; text-decoration:none; color:inherit; transition:border-color .2s ease, transform .2s ease, box-shadow .2s ease; }
.mi-card:hover{ border-color:#7C8890; transform:translateY(-2px); box-shadow:0 8px 24px rgba(20,24,28,.06); }
.mi-cover{ aspect-ratio:16/10; background:#E9EEEA; position:relative; overflow:hidden; }
.mi-cover img{ width:100%; height:100%; object-fit:cover; display:block; }
.mi-cover .channel{ position:absolute; inset:0; opacity:.55; }
.mi-body{ padding:18px 18px 16px; display:flex; flex-direction:column; gap:8px; flex:1; }
.mi-cat{ font-family:var(--font-montserrat),sans-serif; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:#B8402C; }
.mi-card-title{ font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:1.1rem; line-height:1.25; letter-spacing:-.01em; color:#14181C; margin:0; }
.mi-card:hover .mi-card-title{ color:#3B6B55; }
.mi-ex{ font-size:.92rem; line-height:1.55; color:#4A555D; margin:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.mi-meta{ margin-top:auto; padding-top:12px; display:flex; align-items:center; gap:8px; font-family:var(--font-montserrat),sans-serif; font-size:11px; color:#7C8890; }
.mi-avatar{ width:24px; height:24px; border-radius:50%; background:#14181C; color:#fff; display:grid; place-items:center; font-size:9.5px; font-weight:700; }
.mi-empty{ color:#7C8890; }
@media(max-width:1000px){ .mi-grid{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:640px){ .mi-grid{ grid-template-columns:1fr; } }
.mi-topics{ margin-top:56px; max-width:820px; }
.mi-topics > div + div{ margin-top:26px; }
.mi-topics h2{ font-family:var(--font-montserrat),sans-serif; font-weight:700; font-size:1.3rem; letter-spacing:-.01em; color:#14181C; margin:0 0 8px; }
.mi-topics p{ color:#3B4650; font-size:1.02rem; line-height:1.65; margin:0; max-width:70ch; }
`

export default async function MagazinIndexPage(props: Props) {
  const { countryCode } = await props.params
  const { articles } = await listArticles(countryCode, { limit: 24 })

  return (
    <div className="mvh">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mi-wrap">
        <header>
          <span className="mi-eyebrow">Magazin</span>
          <h1 className="mi-title">Vacuum Packaging, Kitchen &amp; Equipment Guides</h1>
          <p className="mi-sub">
            Practical guides, expert tips and interesting stories about vacuum
            packaging, vacuum machines, food preservation, kitchen equipment and
            professional solutions from Planeta Industries.
          </p>
        </header>

        <div className="mi-rule" />

        {articles.length === 0 ? (
          <p className="mi-empty">Noch keine Artikel.</p>
        ) : (
          <div className="mi-grid">
            {articles.map((a) => (
              <ArticleCardView key={a.id} article={a} countryCode={countryCode} />
            ))}
          </div>
        )}

        <div className="mi-rule" />
        <section className="mi-topics">
          {[
            [
              "Vacuum Packaging & Vacuum Machines",
              "Articles about vacuum sealing, vacuum packaging machines, vacuum bags, chamber vacuum machines and practical applications.",
            ],
            [
              "Food Preservation & Storage",
              "Tips for keeping meat, cheese, vegetables and other foods fresh for longer with vacuum packaging and proper storage.",
            ],
            [
              "Kitchen Tips & Equipment",
              "Practical advice about kitchen equipment, food preparation, storage and everyday use of vacuum technology.",
            ],
            [
              "Professional Vacuum Packaging",
              "Information about vacuum packaging for restaurants, hotels, food production and other professional applications.",
            ],
            [
              "Planeta News & Interesting Stories",
              "News, product stories, technology, films and other interesting topics related to Planeta and vacuum technology.",
            ],
          ].map(([heading, text]) => (
            <div key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function ArticleCardView({ article, countryCode }: { article: ArticleCard; countryCode: string }) {
  const date = formatDate(article.published_at, countryCode)
  return (
    <Link href={`/${countryCode}/magazin/${article.slug}`} className="mi-card">
      <div className="mi-cover">
        {article.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.cover_image} alt={article.title ?? ""} loading="lazy" />
        ) : (
          <div className="channel" />
        )}
      </div>
      <div className="mi-body">
        {article.category ? <span className="mi-cat">{article.category}</span> : null}
        <h2 className="mi-card-title">{article.title}</h2>
        {article.excerpt ? <p className="mi-ex">{article.excerpt}</p> : null}
        <div className="mi-meta">
          {article.author?.name ? <span className="mi-avatar">{initials(article.author.name)}</span> : null}
          {article.author?.name ? <span>{article.author.name}</span> : null}
          {article.author?.name && date ? <span>·</span> : null}
          {date ? <span>{date}</span> : null}
        </div>
      </div>
    </Link>
  )
}
