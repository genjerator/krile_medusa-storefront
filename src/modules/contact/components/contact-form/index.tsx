"use client"

import { sdk } from "@lib/config"
import { useState } from "react"

const MESSAGE_MAX_LENGTH = 256
const CONTACT_FORM_PRODUCT_ID = "contact-form"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await sdk.client.fetch("/store/inquiries", {
        method: "POST",
        body: {
          product_id: CONTACT_FORM_PRODUCT_ID,
          name,
          email,
          message,
          ...(phone && { phone }),
        },
      })
      setSuccess(true)
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-2 border border-ui-border-base rounded-base px-6 py-8 items-start">
        <p className="text-ui-fg-base font-semibold">Vielen Dank für Ihre Nachricht!</p>
        <p className="text-sm text-ui-fg-subtle">Wir melden uns so schnell wie möglich bei Ihnen.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ui-fg-base" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ihr Name"
            className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-ui-fg-base" htmlFor="email">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ihre@email.de"
            className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-ui-fg-base" htmlFor="phone">
          Telefon (optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+49 123 456789"
          className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive sm:max-w-xs"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-ui-fg-base" htmlFor="message">
          Nachricht
        </label>
        <textarea
          id="message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX_LENGTH))}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Ihre Nachricht..."
          className="border border-ui-border-base rounded-base px-4 py-2 text-sm text-ui-fg-base bg-ui-bg-field focus:outline-none focus:border-ui-border-interactive resize-none"
        />
        <p className="text-right text-xs text-ui-fg-muted">
          {message.length}/{MESSAGE_MAX_LENGTH}
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start bg-brand-navy text-white text-sm px-6 py-2 rounded-base hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Wird gesendet…" : "Absenden"}
      </button>
    </form>
  )
}
