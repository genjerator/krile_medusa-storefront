"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"

const LANGUAGES = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
]

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentCode = (params?.countryCode as string) || "de"
  const current = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function switchLanguage(code: string) {
    setOpen(false)
    const segments = pathname.split("/")
    segments[1] = code
    router.push(segments.join("/"))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-white text-sm hover:text-white/70 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span className="hidden small:inline">{current.code.toUpperCase()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 bg-brand-navy border border-white/20 rounded-md shadow-lg z-50 py-1"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === currentCode}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors
                  ${lang.code === currentCode
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
