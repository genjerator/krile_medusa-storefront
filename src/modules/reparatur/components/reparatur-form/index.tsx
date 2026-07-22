"use client"

import { sdk } from "@lib/config"
import { useState } from "react"

const DESCRIPTION_MAX_LENGTH = 4000

type FormState = {
  kd_nr: string
  name: string
  vorname: string
  strasse_nr: string
  plz: string
  ort: string
  land: string
  tel: string
  email: string
  kunden_nummer: string
  geraete_nummer: string
  datum: string
  beschreibung: string
  unterschrift_ort: string
  unterschrift_datum: string
  unterschrift: string
}

const INITIAL: FormState = {
  kd_nr: "",
  name: "",
  vorname: "",
  strasse_nr: "",
  plz: "",
  ort: "",
  land: "Deutschland",
  tel: "",
  email: "",
  kunden_nummer: "",
  geraete_nummer: "",
  datum: "",
  beschreibung: "",
  unterschrift_ort: "",
  unterschrift_datum: "",
  unterschrift: "",
}

const inputClass =
  "border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive"

const Field = ({
  label,
  htmlFor,
  required,
  children,
  className,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) => (
  <div className={`flex flex-col gap-1 ${className ?? ""}`}>
    <label className="text-sm font-medium text-ui-fg-base" htmlFor={htmlFor}>
      {label}
      {required && <span className="text-red-600"> *</span>}
    </label>
    {children}
  </div>
)

export default function ReparaturForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value
      setForm((f) => ({ ...f, [key]: value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await sdk.client.fetch("/store/reparatur", {
        method: "POST",
        body: {
          ...form,
          locale: window.location.pathname.split("/")[1] || undefined,
          source_url: window.location.href,
        },
      })
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-2 border border-ui-border-base rounded-base px-6 py-8 items-start">
        <p className="text-ui-fg-base font-semibold">Vielen Dank für Ihre Reparaturanfrage!</p>
        <p className="text-sm text-ui-fg-subtle">
          Wir haben Ihre Anfrage erhalten und melden uns so schnell wie möglich bei Ihnen. Eine
          Bestätigung wurde an Ihre E-Mail-Adresse gesendet.
        </p>
        <a
          href="/Reparaturformular_fi.pdf"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-brand-navy font-medium hover:underline mt-2"
        >
          Reparaturformular als PDF herunterladen (bitte dem Paket beilegen)
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Auftraggeber */}
      <fieldset className="flex flex-col gap-6">
        <legend className="text-lg font-semibold text-ui-fg-base mb-2">Auftraggeber</legend>
        <Field label="Kd. Nr." htmlFor="kd_nr">
          <input id="kd_nr" type="text" value={form.kd_nr} onChange={set("kd_nr")} className={inputClass} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Name" htmlFor="name" required>
            <input id="name" type="text" required value={form.name} onChange={set("name")} className={inputClass} />
          </Field>
          <Field label="Vorname" htmlFor="vorname" required>
            <input id="vorname" type="text" required value={form.vorname} onChange={set("vorname")} className={inputClass} />
          </Field>
        </div>

        <Field label="Strasse / Nr." htmlFor="strasse_nr" required>
          <input id="strasse_nr" type="text" required value={form.strasse_nr} onChange={set("strasse_nr")} className={inputClass} />
        </Field>

        <div className="grid sm:grid-cols-3 gap-6">
          <Field label="PLZ" htmlFor="plz" required>
            <input id="plz" type="text" required value={form.plz} onChange={set("plz")} className={inputClass} />
          </Field>
          <Field label="Ort" htmlFor="ort" required>
            <input id="ort" type="text" required value={form.ort} onChange={set("ort")} className={inputClass} />
          </Field>
          <Field label="Land" htmlFor="land" required>
            <input id="land" type="text" required value={form.land} onChange={set("land")} className={inputClass} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Tel." htmlFor="tel">
            <input id="tel" type="tel" value={form.tel} onChange={set("tel")} className={inputClass} />
          </Field>
          <Field label="E-Mail" htmlFor="email" required>
            <input id="email" type="email" required value={form.email} onChange={set("email")} className={inputClass} />
          </Field>
        </div>

      </fieldset>

      {/* Gerät */}
      <fieldset className="flex flex-col gap-6">
        <legend className="text-lg font-semibold text-ui-fg-base mb-2">Gerät</legend>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Kunden-Nummer" htmlFor="kunden_nummer">
            <input id="kunden_nummer" type="text" value={form.kunden_nummer} onChange={set("kunden_nummer")} className={inputClass} />
          </Field>
          <Field label="Geräte-Nummer" htmlFor="geraete_nummer">
            <input id="geraete_nummer" type="text" value={form.geraete_nummer} onChange={set("geraete_nummer")} className={inputClass} />
          </Field>
        </div>
        <Field label="Beschreibung" htmlFor="beschreibung" required>
          <textarea
            id="beschreibung"
            rows={8}
            required
            value={form.beschreibung}
            onChange={(e) => setForm((f) => ({ ...f, beschreibung: e.target.value.slice(0, DESCRIPTION_MAX_LENGTH) }))}
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="Bitte beschreiben Sie den Fehler / das Anliegen…"
            className={`${inputClass} resize-none`}
          />
          <p className="text-right text-xs text-ui-fg-muted">
            {form.beschreibung.length}/{DESCRIPTION_MAX_LENGTH}
          </p>
        </Field>
      </fieldset>

      {/* Unterschrift */}
      <fieldset className="flex flex-col gap-6">
        <legend className="text-lg font-semibold text-ui-fg-base mb-2">Unterschrift</legend>
        <div className="grid sm:grid-cols-3 gap-6">
          <Field label="Ort" htmlFor="unterschrift_ort">
            <input id="unterschrift_ort" type="text" value={form.unterschrift_ort} onChange={set("unterschrift_ort")} className={inputClass} />
          </Field>
          <Field label="Datum" htmlFor="unterschrift_datum">
            <input id="unterschrift_datum" type="date" value={form.unterschrift_datum} onChange={set("unterschrift_datum")} className={inputClass} />
          </Field>
          <Field label="Unterschrift (Name)" htmlFor="unterschrift">
            <input id="unterschrift" type="text" value={form.unterschrift} onChange={set("unterschrift")} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start bg-brand-navy text-white text-sm px-6 py-2 rounded-base hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Wird gesendet…" : "Reparaturanfrage absenden"}
      </button>
    </form>
  )
}
