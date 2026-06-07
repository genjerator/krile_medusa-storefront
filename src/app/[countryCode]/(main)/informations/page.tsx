import { Metadata } from "next"
import LegalTabs from "./legal-tabs"

export const metadata: Metadata = {
  title: "Informations",
  description: "Allgemeine Information",
}

export default function InformationsPage() {
  return (
    <div className="content-container py-16 max-w-2xl">
      <h1 className="heading-product text-ui-fg-base mb-10">Allgemeine Information</h1>

      <section>
        <h2 className="heading-section text-ui-fg-base mb-4">Payment Methods</h2>

        <h3 className="font-heading font-semibold uppercase tracking-widest text-xs text-ui-fg-base mb-3">Bank details</h3>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 text-sm">
          <dt className="text-ui-fg-muted">Owner</dt>
          <dd className="text-ui-fg-base">Planeta GmbH &amp; Co. KG</dd>

          <dt className="text-ui-fg-muted">Institute</dt>
          <dd className="text-ui-fg-base">Savings Bank MM-LI-MN</dd>

          <dt className="text-ui-fg-muted">BIC / SWIFT</dt>
          <dd className="text-ui-fg-base font-sans">BYLADEM1MLM</dd>

          <dt className="text-ui-fg-muted">IBAN</dt>
          <dd className="text-ui-fg-base font-sans">DE10 7315 0000 1002 0935 14</dd>
        </dl>
      </section>

      <LegalTabs />
    </div>
  )
}
