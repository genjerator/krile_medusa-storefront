# Static-first storefront plan (performance / TTFB)

Status: **planning only — not implemented.** This documents the goal, the root
cause, and the concrete plan. No code has been changed as part of writing this.

Primary target: **planetaindustries.de** (`krile_medusa-storefront`). Apply to
`planetagmbh_medusa-storefront` afterwards (its build is currently broken — see
the `/404` note at the end).

---

## 1. Goal

Make the storefront much faster (lower server response time / TTFB) without
losing SEO or rebuilding the shop.

- Current measured avg server response (planetaindustries.de, 24h): **~561 ms**.
- Target: static HTML served in **tens of ms** (or single-digit ms via a CDN).

The idea the client wants: *"static pages, and Medusa regenerates a page when its
product changes; plain HTML + JS for the interactive parts."* That is exactly
**Next.js SSG + ISR (Incremental Static Regeneration)** — and this storefront
already has most of the plumbing for it.

---

## 2. Root cause of the 561 ms

Every page renders **dynamically** (server-side on every request). TTFB is
dominated by that per-request React render on the Node storefront (single core),
plus a few Medusa calls.

The reason pages can't be static today is **one architectural fact**:

> The shared `src/app/[countryCode]/(main)/layout.tsx` reads `cookies()`
> server-side (via `retrieveCustomer()` and `retrieveCart()`), and the Nav's
> `CartButton` does too (`retrieveCart()`). Reading `cookies()` during render
> forces Next to render the whole route dynamically → no static HTML, no
> full-route cache.

Confirmed cookie-reading server code:
- `src/app/[countryCode]/(main)/layout.tsx` → `retrieveCustomer()`,
  `retrieveCart()`, `listCartOptions()`.
- `src/modules/layout/components/cart-button/index.tsx` (server component) →
  `retrieveCart()`.

These feed components that are **already client components** and just receive the
data as props:
- `cart-dropdown` (`"use client"`) — receives `cart`.
- `cart-mismatch-banner` (`"use client"`) — receives `customer` + `cart`.
- `free-shipping-price-nudge` (`"use client"`) — receives `cart` + `shippingOptions`.

---

## 3. What we already have (so this is not a rewrite)

- `GET /store/products` fetches use `cache: "force-cache"` + tags; the product
  detail page was made to cache via `export const fetchCache = "force-cache"`
  (already deployed). Repeat requests serve product data from Next's Data Cache
  (Medusa untouched).
- An on-demand revalidation endpoint: `src/app/api/revalidate/route.ts`
  (`revalidateTag` + `revalidatePath("/", "layout")`).
- Backend emits product events; wiring those to `/api/revalidate` gives
  "regenerate the page when the product changes" = ISR.
- Already-shipped Medusa-load reductions this cycle: product query cached;
  wasted anonymous `/store/customers/me` call fixed; dead 1.8 MB footer
  `listCategories()` removed (footer fix staged, not yet pushed at time of writing).

---

## 4. The cart has no server session (how "static + cart" works)

Medusa is headless/stateless. A cart is just a record identified by an id
(`cart_01…`). There is **no server session**:

1. Create a cart lazily on first add: `POST /store/carts` → returns `id`.
2. Persist the `id` in the browser.
3. Every cart action is a REST call with that id: `GET /store/carts/{id}`,
   `POST /store/carts/{id}/line-items`, … `POST /store/carts/{id}/complete`.
4. Requests carry the **publishable API key** (`x-publishable-api-key`) — public,
   safe to expose, scopes to the sales channel.

So on a static page, the cart is a **client "island"**: static HTML ships with an
empty cart widget; client JS reads the cart id, fetches the cart, and fills the
badge/drawer. Product/category/home HTML stays 100 % static.

### Important nuance: the cart id cookie is `httpOnly`

`src/lib/data/cookies.ts` stores `_medusa_cart_id` with `httpOnly: true`, so
client JS **cannot** read it via `document.cookie`. That means we do **not** want
the browser reading the id directly.

**Decision: keep the httpOnly cookie and the existing server actions.** We do not
migrate the cart id to `localStorage` and we do not rewrite the cart/checkout.
This avoids a large, risky rewrite and keeps the id out of reach of XSS.

`src/lib/data/cart.ts` and `src/lib/data/customer.ts` both start with
`"use server"`, so their exported async functions (`retrieveCart`,
`retrieveCustomer`, `listCartOptions`, add/update line items, etc.) are **Server
Actions** and can be called directly from client components.

---

## 5. The chosen approach (minimal, keeps checkout intact)

Move the cart/customer **fetch** from server-render time to **client, after load**
— by calling the existing `"use server"` actions from a client provider in a
`useEffect`. The page is rendered statically (no `cookies()` during render); the
server action runs on-demand when the client calls it (a runtime POST that reads
the httpOnly cookie), and the cart badge/drawer hydrate afterwards.

Why this keeps the page static: a Server Action invoked from `useEffect` is a
runtime call, **not** part of static generation. Nothing in the render path reads
`cookies()`, so Next can prerender the route and ISR-revalidate it.

### Files that would change (when implemented — NOT done yet)

1. **New** `src/lib/context/cart-context.tsx` (client): `CartProvider` +
   `useCart()`. On mount, calls the `retrieveCart()` / `retrieveCustomer()` server
   actions, holds `{ cart, customer, refreshCart }`, exposes `refreshCart()` for
   after add-to-cart. (Optionally `listCartOptions()` when a cart exists, for the
   free-shipping nudge.)
2. **Edit** `src/app/[countryCode]/(main)/layout.tsx`: remove the three
   server-side fetches; wrap the content in `<CartProvider>`. The layout no longer
   reads `cookies()` → route can go static. (A client provider can wrap server
   children via the `children` prop.)
3. **Edit** `src/modules/layout/components/cart-button/index.tsx`: convert from a
   server component that calls `retrieveCart()` into a **client** component that
   reads the cart from `useCart()` and renders `CartDropdown`.
4. **Rewire** `cart-mismatch-banner` and `free-shipping-price-nudge`: get
   `cart` / `customer` / `shippingOptions` from `useCart()` instead of layout props.
5. **Add-to-cart** path: after a successful add (existing server action), call
   `refreshCart()` so the badge updates. (Verify the product add-to-cart component
   triggers a refresh.)
6. Keep `export const fetchCache = "force-cache"` where relevant; confirm
   `product` / `category` / `home` show as static/ISR in the `next build` output.

### Regeneration on product change (the "Medusa creates the page" part)

Ensure a backend subscriber on product create/update/delete calls the storefront
`/api/revalidate` with the right tags (and/or `revalidatePath`). This is what
rebuilds the specific static page when a product changes — i.e. ISR.

---

## 6. What stays dynamic (and that's fine)

- **Cart, checkout, PayPal, account/login** — per-user, client-driven against the
  cart id. The checkout flow is unchanged (still the existing server actions);
  only the browse pages become static.
- **Vacuum-bag configurator** — already client-interactive; the page shell can be
  static, the configurator JS runs client-side.

---

## 7. Risks & testing checklist

- **Cart badge flash:** the badge is empty for a moment after load, then fills
  (standard for static-first). Acceptable.
- Must manually verify in a browser after the change:
  - [ ] Cart badge count hydrates on load.
  - [ ] Add-to-cart updates the badge + drawer.
  - [ ] Cart drawer contents correct.
  - [ ] Cart-mismatch banner still appears when relevant (logged-in + guest cart).
  - [ ] Free-shipping nudge still works.
  - [ ] Full checkout + PayPal still completes.
- Build must pass (`pnpm build`) and the browse routes must show as **static/ISR**
  (not `ƒ Dynamic`) in the build output.
- Validate locally with `pnpm build && pnpm start` (production mode — dev mode
  does not apply the Data Cache). Use a free port (8000 is taken; 8099 is a Docker
  Go app).
- The httpOnly `_medusa_cart_id` cookie stays as-is (no security regression).

---

## 8. Rollout

1. **Krile (`krile_medusa-storefront`) first** — it builds cleanly and is
   deployable. Implement, validate locally, deploy, re-measure TTFB.
2. **Planeta (`planetagmbh_medusa-storefront`)** — only after its pre-existing
   `/404` build break is fixed (see below).
3. **Later / optional:** front the VPS with a CDN (e.g. Cloudflare). Once pages are
   static/cacheable, the edge can serve them in ~10–50 ms and offload the VPS. This
   is the biggest additional TTFB win and is only possible after the pages are
   cacheable (today everything is `no-store` because the layout is dynamic).

---

## 9. Alternatives considered

- **Client-only plain-JS SPA** — rejected: it would send empty HTML and break SEO
  (especially for Bing), the opposite of recent SEO work.
- **Hand-rolled plain HTML/JS generator + custom cart/checkout in a new repo** —
  rejected for now: the static browse pages are the easy ~20 %; rebuilding cart,
  checkout, PayPal, configurator, i18n, accounts is the hard ~80 % and months of
  work. It also reimplements what Next SSG+ISR already provides.
- **Astro** — the reasonable choice *if* the goal is to leave Next entirely:
  static-first with "islands" for cart/configurator, calls Medusa REST, far simpler
  than Next. Still requires porting the interactive parts. Not needed if we simply
  make the current Next app static (this plan).

**Chosen:** make the current Next app static (Section 5) — same end state the
client described (static pages regenerated on product change + JS for
interactivity), a fraction of the work, and zero checkout rebuild.

---

## 10. Related blocker — planeta `/404` build

`planetagmbh_medusa-storefront` currently **fails `pnpm build`** while prerendering
the Pages-fallback `/_error` / `/404`:
`TypeError: Cannot read properties of null (reading 'useRef')`.

- Pre-existing; not caused by the SEO/caching work (fails with and without it).
- Not a package-manager issue (fails on npm and pnpm); single React copy; no custom
  `pages/_error`; simplifying `not-found.tsx` and removing `CookieConsent` did not
  fix it.
- Likely a **Next 15.3.9 + next-intl** interaction (root layout uses
  `next-intl`'s `getLocale()`), crashing the pages-fallback error-page prerender.
- Impact: planeta deploys fail in CI → planeta.de serves an **older image**.
  Nothing (SEO fixes, magazin German copy, this static work) can ship to planeta
  until it's fixed.
- Likely fix (its own task): bump Next (15.3.9 → latest 15.5.x, or 16), validated
  on a branch with a passing `pnpm build`; or a next-intl request-config guard for
  the no-locale error-page render.

---

## 11. Current versions (for the related Node/Next upgrade discussion)

- Backend `krile_medusa`: Medusa 2.13.6, React 18.3.1, Docker `node:20-alpine`
  (Medusa officially supports Node 20/22).
- Both storefronts: Next **15.3.9**, React 19.0.5, Docker `node:20-alpine`.
- Latest at time of writing: Next **16.4.0** (major), latest 15.x **15.5.27**;
  Node LTS 24 (local already v24.15.0). Next 16 needs Node ≥ 20.9 and React 18.2+/19.
- Suggested conservative path: Next **15.5.27** first (low-risk, likely also fixes
  the planeta `/404`), Node base `22` for backend / `24` for storefronts.
