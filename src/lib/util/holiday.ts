// Collective company holiday (Betriebsferien) — closed 2026-08-18 through
// 2026-09-10 inclusive. During this window the homepage shows a holiday
// notice instead of the weekly-action section. Update these dates for future
// years, or remove the check once no longer needed.
const HOLIDAY_START = new Date("2026-08-17T00:00:00+02:00")
const HOLIDAY_END_EXCLUSIVE = new Date("2026-09-11T00:00:00+02:00")

export const isCollectiveHolidayActive = (): boolean => {
  const now = new Date()
  return now >= HOLIDAY_START && now < HOLIDAY_END_EXCLUSIVE
}
