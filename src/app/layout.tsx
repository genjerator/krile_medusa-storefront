import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Inter, Montserrat } from "next/font/google"
import CookieConsent from "@modules/common/components/cookie-consent"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | Planeta Industries",
    default: "Planeta Industries",
  },
  description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion. Entwickelt für Lebensmittel-, Pharma- und Industrieumgebungen.",
  authors: [{ name: "Planeta Industries" }],
  creator: "Planeta Industries",
  publisher: "Planeta Industries",
  openGraph: {
    type: "website",
    siteName: "Planeta Industries",
    title: "Planeta Industries",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion.",
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
    card: "summary_large_image",
    title: "Planeta Industries",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion.",
    images: ["/planeta-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.planetaindustries.de",
  },
  themeColor: "#0F1E46",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} data-mode="light" className={`${inter.variable} ${montserrat.variable}`}>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Planeta Industries",
              "url": "https://www.planetaindustries.de",
              "logo": "https://www.planetaindustries.de/planeta_logo.png",
              "description": "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion. Entwickelt für Lebensmittel-, Pharma- und Industrieumgebungen.",

              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["German", "English"]
              }
            })
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <main className="relative">{props.children}</main>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
