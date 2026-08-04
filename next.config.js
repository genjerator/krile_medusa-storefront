const checkEnvVariables = require("./check-env-variables")
const createNextIntlPlugin = require("next-intl/plugin")

checkEnvVariables()

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  compress: true,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Canonical product URL is /product/<handle>. Old /products/<handle>
        // detail URLs (still in Google's index and old links) 301 here so
        // ranking signals consolidate. The /products listing page (no handle)
        // is unaffected — this only matches when a handle segment follows.
        source: "/:countryCode/products/:handle",
        destination: "/:countryCode/product/:handle",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // Next.js static assets — already immutable, but explicit for clarity
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Images in /public
        source: "/:path*.(jpg|jpeg|png|gif|webp|svg|ico|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        // Fonts in /public
        source: "/:path*.(woff|woff2|ttf|otf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
      {
        // Videos in /public
        source: "/:path*.(mp4|webm|ogg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000" },
        ],
      },
    ]
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve modern formats; Next negotiates AVIF first, then WebP, per browser.
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 30 days to limit re-optimization CPU cost.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "krilemedusa-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "krile-medusa-313003894447-eu-central-1-an.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dpc56b2hptc18.cloudfront.net",
        pathname: "/**",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = withNextIntl(nextConfig)
