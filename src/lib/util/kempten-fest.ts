// Kempten Festwoche 2026 — we have a stand there 2026-07-31 through
// 2026-08-18 inclusive. During this window the homepage shows a notice with
// the event poster. Update these dates for future years, or remove the check
// once no longer needed.
const FEST_START = new Date("2026-07-31T00:00:00+02:00")
const FEST_END_EXCLUSIVE = new Date("2026-08-17T00:00:00+02:00")

export const isKemptenFestActive = (): boolean => {
  const now = new Date()
  return now >= FEST_START && now < FEST_END_EXCLUSIVE
}
