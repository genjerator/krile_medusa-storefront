import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_REGION,
  getCountryCode,
  getLocale,
  getRegionMap,
} from "@lib/util/regions"

// Maintenance mode: while true, every route serves the /maintenance page.
// Set to false to restore the normal site (region routing below runs again).
const MAINTENANCE_MODE = true

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  // check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  // Under-construction mode — rewrite all pages to /maintenance.
  if (MAINTENANCE_MODE) {
    if (request.nextUrl.pathname === "/maintenance") {
      return NextResponse.next()
    }
    return NextResponse.rewrite(new URL("/maintenance", request.url))
  }

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCode = (regionMap && (await getCountryCode(request, regionMap))) || DEFAULT_REGION
  const locale = getLocale(countryCode)

  const urlFirstSegment = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  const urlHasCountryCode = regionMap.has(urlFirstSegment)

  // If URL already has a country code, serve normally
  if (urlHasCountryCode) {
    const res = NextResponse.next()
    res.cookies.set("_medusa_locale", locale, { maxAge: 60 * 60 * 24 * 365, httpOnly: false, sameSite: "strict", secure: process.env.NODE_ENV === "production" })
    if (!cacheIdCookie) res.cookies.set("_medusa_cache_id", cacheId, { maxAge: 60 * 60 * 24 })
    return res
  }

  // No country code in URL — rewrite to /de/... without redirecting
  const path = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  const query = request.nextUrl.search || ""
  const rewriteUrl = new URL(`/${DEFAULT_REGION}${path}${query}`, request.url)
  const res = NextResponse.rewrite(rewriteUrl)
  res.cookies.set("_medusa_locale", locale, { maxAge: 60 * 60 * 24 * 365, httpOnly: false, sameSite: "strict", secure: process.env.NODE_ENV === "production" })
  if (!cacheIdCookie) res.cookies.set("_medusa_cache_id", cacheId, { maxAge: 60 * 60 * 24 })
  return res
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
