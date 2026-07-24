import { ReactNode } from "react"
import ContentBlockAccordion from "@modules/categories/components/content-block-accordion"
import RotatingImages, {
  RotatingImage,
} from "@modules/categories/components/rotating-images"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Closing note under the section, inviting a request for other dimensions.
const CONTACT_NOTE: Record<string, { text: string; cta: string }> = {
  de: { text: "Du benötigst eine andere Abmessung?", cta: "Kontaktiere uns gerne." },
  en: { text: "Need a different size?", cta: "Feel free to contact us." },
  it: { text: "Ti serve un'altra misura?", cta: "Non esitare a contattarci." },
}

// Rotating product photos shown in the right column, served from S3.
const S3_BASE =
  "https://krile-medusa-313003894447-eu-central-1-an.s3.eu-central-1.amazonaws.com/sections/vakuum-bags"
const IMAGES: RotatingImage[] = [
  { src: `${S3_BASE}/easy-vac-boss-niederwieser.jpg`, alt: "EasyVac Boss" },
  { src: `${S3_BASE}/easy-vac-guss-niederwieser.jpg`, alt: "EasyVac Guss" },
  { src: `${S3_BASE}/easy-vac-pro-niederwieser.jpg`, alt: "EasyVac Pro" },
]

// Inline SVG icons (lucide paths) shown next to each headline. Shared wrapper
// keeps sizing/colour consistent with the accordion's thermometer.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 shrink-0 text-brand-navy",
  "aria-hidden": true,
}

const ThermometerIcon = () => (
  <svg {...iconProps}>
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
)

const GearIcon = () => (
  <svg {...iconProps}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const LinkIcon = () => (
  <svg {...iconProps}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const PencilLineIcon = () => (
  <svg {...iconProps}>
    <path d="M12 20h9" />
    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
  </svg>
)

const RecycleIcon = () => (
  <svg {...iconProps}>
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
    <path d="m14 16-3 3 3 3" />
    <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
  </svg>
)

const PhoneIcon = () => (
  <svg {...iconProps} className="h-4 w-4 shrink-0 text-brand-navy">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

// Icon per headline, in order.
const ICONS: ReactNode[] = [
  <ThermometerIcon key="thermometer" />,
  <GearIcon key="gear" />,
  <LinkIcon key="link" />,
  <PencilLineIcon key="pencil" />,
  <RecycleIcon key="recycle" />,
]

/**
 * Static "Vakuum-Bags" section, rendered on a category page when its
 * `content_block_top` metadata is set to `section-vakuum-bags`. The copy lives
 * here in code (not in a DB content block) and displays as a collapsible
 * headline accordion: only the headlines show, click reveals the text; the
 * first headline carries a thermometer icon.
 *
 * To localise, add the locale's HTML to CONTENT (keyed by "de" | "en" | "it").
 * Missing locales fall back to German.
 */
const CONTENT: Record<string, string> = {
  de: `
    <h2>Hitzebeständige Beutel für die Lebensmittelverarbeitung</h2>
    <p>Unsere Vakuumbeutel sind so konzipiert, dass sie thermische Prozesse problemlos meistern. Ob Pasteurisation, Autoklavensterilisation, Cook-in oder Sous-vide – deine Produkte bleiben sicher verpackt.</p>

    <h2>Perfekt abgestimmt auf deine Vakuumkammermaschinen</h2>
    <p>Effizienz ist entscheidend. Unsere Vakuumbeutel sind vielseitig einsetzbar und passen zu einer großen Auswahl an Vakuumverpackungsmaschinen.</p>

    <h2>Maschinengängigkeit, die den Unterschied macht</h2>
    <p>Unsere Vakuumbeutel sind auf hohe mechanische Belastbarkeit ausgelegt und meistern anspruchsvolle Prozesse und Handhabung. Das Ergebnis ist ein zuverlässiger Schutz deiner Produkte – von der Produktion bis ins Regal.</p>

    <h2>Deine Verpackung, deine Regeln</h2>
    <p>Personalisiere deine Vakuumbeutel nach deinen Wünschen – von individuellen Etiketten über farbige Flyer bis hin zu bedruckten Kartons. Du entscheidest über die Anzahl pro Packung und kannst verschiedene Größen auf einer Palette kombinieren.</p>
    <p>Mit <strong>n.go</strong> sind Standardgrößen stets verfügbar und innerhalb von 48 Stunden versandbereit. So kannst du nach Bedarf bestellen und deine Lagerkosten reduzieren.</p>

    <h2>Wenn Verpackung mehr bewahrt als nur Lebensmittel</h2>
    <p>Nachhaltigkeit ohne Kompromisse: EasyVac Vakuumbeutel sind auch in zertifiziert recycelbaren Varianten erhältlich und bieten die gleiche hohe Barrierewirkung wie Standardbeutel – bei kleinerem ökologischen Fußabdruck.</p>
  `,
  en: `
    <h2>Heat-resistant bags for food processing</h2>
    <p>Our vacuum bags are designed to handle thermal processes with ease. Whether pasteurisation, autoclave sterilisation, cook-in or sous-vide – your products stay safely packaged.</p>

    <h2>Perfectly matched to your vacuum chamber machines</h2>
    <p>Efficiency is key. Our vacuum bags are highly versatile and fit a wide range of vacuum packaging machines.</p>

    <h2>Machine performance that makes the difference</h2>
    <p>Our vacuum bags are built for high mechanical strength and master demanding processes and handling. The result is reliable protection for your products – from production to the shelf.</p>

    <h2>Your packaging, your rules</h2>
    <p>Personalise your vacuum bags to your needs – from individual labels and coloured flyers to printed boxes. You decide the quantity per pack and can combine different sizes on a single pallet.</p>
    <p>With <strong>n.go</strong>, standard sizes are always available and ready to ship within 48 hours. So you can order as needed and reduce your inventory costs.</p>

    <h2>When packaging preserves more than just food</h2>
    <p>Sustainability without compromise: EasyVac vacuum bags are also available in certified recyclable versions, offering the same high barrier performance as standard bags – with a smaller ecological footprint.</p>
  `,
  it: `
    <h2>Buste resistenti al calore per la lavorazione alimentare</h2>
    <p>Le nostre buste sottovuoto sono progettate per gestire con facilità i processi termici. Che si tratti di pastorizzazione, sterilizzazione in autoclave, cook-in o sous-vide, i tuoi prodotti restano confezionati in sicurezza.</p>

    <h2>Perfettamente compatibili con le tue macchine per sottovuoto a campana</h2>
    <p>L'efficienza è fondamentale. Le nostre buste sottovuoto sono estremamente versatili e si adattano a un'ampia gamma di macchine per il confezionamento sottovuoto.</p>

    <h2>Una resa in macchina che fa la differenza</h2>
    <p>Le nostre buste sottovuoto sono progettate per un'elevata resistenza meccanica e affrontano processi e manipolazioni impegnativi. Il risultato è una protezione affidabile dei tuoi prodotti, dalla produzione allo scaffale.</p>

    <h2>Il tuo imballaggio, le tue regole</h2>
    <p>Personalizza le tue buste sottovuoto secondo le tue esigenze: da etichette personalizzate a volantini colorati fino a scatole stampate. Decidi tu la quantità per confezione e puoi combinare diverse misure su un unico pallet.</p>
    <p>Con <strong>n.go</strong> le misure standard sono sempre disponibili e pronte per la spedizione entro 48 ore. Così puoi ordinare in base alle necessità e ridurre i costi di magazzino.</p>

    <h2>Quando l'imballaggio preserva più del solo cibo</h2>
    <p>Sostenibilità senza compromessi: le buste sottovuoto EasyVac sono disponibili anche in versioni certificate riciclabili e offrono lo stesso elevato effetto barriera delle buste standard, con un'impronta ecologica ridotta.</p>
  `,
}

export default function VakuumBagsSection({ locale = "de" }: { locale?: string }) {
  const html = CONTENT[locale] ?? CONTENT.de
  const note = CONTACT_NOTE[locale] ?? CONTACT_NOTE.de
  return (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-8 medium:gap-12 items-start">
      {/* Column 1 — collapsible text + contact note */}
      <div className="min-w-0">
        <ContentBlockAccordion html={html} icons={ICONS} />

        {/* Closing contact note, under the accordion */}
        <p className="mt-6 flex items-center gap-2 text-sm text-ui-fg-subtle">
          <PhoneIcon />
          <span>
            {note.text}{" "}
            <LocalizedClientLink
              href="/kontakt"
              className="font-medium text-brand-navy underline"
            >
              {note.cta}
            </LocalizedClientLink>
          </span>
        </p>
      </div>
      {/* Column 2 — rotating product photos */}
      <div className="medium:sticky medium:top-32">
        <RotatingImages images={IMAGES} />
      </div>
    </div>
  )
}
