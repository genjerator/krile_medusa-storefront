import { Metadata } from "next"
import ReparaturForm from "@modules/reparatur/components/reparatur-form"

export const metadata: Metadata = {
  title: "Reparaturformular",
  description: "Reparaturanfrage online ausfüllen und absenden.",
}

export default function ReparaturPage() {
  return (
    <div className="content-container py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-ui-fg-base mb-4">Reparaturformular</h1>
      <div className="flex flex-col gap-3 text-sm text-ui-fg-subtle leading-relaxed mb-8">
        <p>
          Füllen Sie das Formular aus, um ein Gerät zur Reparatur einzusenden. Wir melden uns nach
          Eingang Ihrer Anfrage bei Ihnen. Bitte drucken Sie das{" "}
          <a
            href="/Reparaturformular_fi.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-brand-navy font-medium hover:underline"
          >
            Reparaturformular (PDF)
          </a>{" "}
          aus und legen Sie es dem Paket bei.
        </p>
        <p className="text-ui-fg-muted">
          Es können nur Sendungen mit vollständig ausgefülltem Formular angenommen werden.
        </p>
      </div>
      <ReparaturForm />
    </div>
  )
}
