// Oberschwabenschau 2026 (Ravensburg) — we have a stand there
// 14.10.2026 through 18.10.2026 inclusive. From now until the fair ends the
// homepage shows a notice with the event key visual. Update these dates for
// future years, or remove the check once no longer needed.
const FAIR_ANNOUNCE_FROM = new Date("2026-10-01T00:00:00+02:00")
const FAIR_END_EXCLUSIVE = new Date("2026-10-19T00:00:00+02:00")

export const isOberschwabenschauActive = (): boolean => {
  const now = new Date()
  return now >= FAIR_ANNOUNCE_FROM && now < FAIR_END_EXCLUSIVE
}
