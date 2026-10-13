// Parallel-route fallback for the @login slot. Next 16 enforces strict route
// matching: every URL a sibling slot (@dashboard) can render must also resolve
// in this slot. The account layout only shows one slot at a time (login vs
// dashboard), so this fallback simply renders nothing for the routes this slot
// doesn't define (e.g. /account/addresses, /account/orders, /account/profile).
export default function Default() {
  return null
}
