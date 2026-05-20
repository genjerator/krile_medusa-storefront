export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const decoded = src.replace(/%2F/gi, "/")
  return `/_next/image?url=${encodeURIComponent(decoded)}&w=${width}&q=${quality ?? 75}`
}
