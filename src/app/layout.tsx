import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import Script from "next/script"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | planeta industries",
    default: "planeta industries",
  },
  description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion. Entwickelt für Lebensmittel-, Pharma- und Industrieumgebungen.",
  keywords: ["Vakuumverpackungsmaschinen", "vacuum packaging", "P-Series", "C-Series", "industrial packaging", "planeta industries"],
  authors: [{ name: "planeta industries" }],
  creator: "planeta industries",
  publisher: "planeta industries",
  openGraph: {
    type: "website",
    siteName: "Planeta Industries",
    title: "planeta industries",
    description: "Hochleistungs-Vakuumverpackungsmaschinen für die Industrieproduktion.",
    images: [
      {
        url: "/planeta-og.jpg",
        width: 1200,
        height: 630,
        alt: "planeta industries – Vakuumverpackungsmaschinen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "planeta industries",
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
    <html lang={locale} data-mode="light">
      <body cz-shortcut-listen="true">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CN1PX0WWDT"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CN1PX0WWDT');
          `}
        </Script>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
