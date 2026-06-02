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
  description: "planeta industries",
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
        <NextIntlClientProvider messages={messages}>
          <main className="relative">{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
