import { Text } from "@medusajs/ui"

type VideoItem = { id: number; src: string; title: string; poster?: string }

const VIDEOS: VideoItem[] = [
  { id: 1, src: "https://dpc56b2hptc18.cloudfront.net/Customer+video+Bull+%26+Claw_EN+with+subtitles.mp4", title: "Customer Video Bull & Claw", poster: "/video-1-poster.webp" },
  { id: 2, src: "https://dpc56b2hptc18.cloudfront.net/Customer+video+Metzgerei+Wenisch_EN.mp4", title: "Customer Video Metzgerei Wenisch", poster: "/video-2-poster.webp" },
  { id: 3, src: "https://dpc56b2hptc18.cloudfront.net/Customer+video+Suinco.mp4", title: "Customer Video Suinco", poster: "/video-3-poster.webp" },
  { id: 4, src: "https://dpc56b2hptc18.cloudfront.net/Customer+Video+Waldburger.mp4", title: "Customer Video Waldburger", poster: "/video-4-poster.webp" },
  { id: 5, src: "https://dpc56b2hptc18.cloudfront.net/Sales+video+C+200.mp4", title: "Sales Video C 200", poster: "/video-5-poster.webp" },
  { id: 6, src: "https://dpc56b2hptc18.cloudfront.net/Sales+video+BASELINE+P+200.mp4", title: "Sales Video BASELINE P 200", poster: "/video-6-poster.webp" },
]

export default function FeaturedFour() {
  return (
    <div className="content-container py-12 small:py-20">
      <div className="flex flex-col items-center text-center mb-10 gap-4">
        <Text className="txt-xlarge font-semibold">VAKUUMVERPACKT KONSERVIEREN</Text>
        <p className="text-ui-fg-subtle text-sm leading-relaxed max-w-2xl">
          Technik, die Ihre Küche radikal verändert.<br />
          Technologie, die die Haltbarkeit der Produkte verlängert.<br />
          Sicherheit, die Geschmack und Qualität garantiert.<br />
          <br />
          Smart Integration of Appliances for high quality and sustainable Food processing
        </p>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-4">
        {VIDEOS.map((video) => (
          <div
            key={video.id}
            className="relative aspect-video rounded-lg overflow-hidden bg-ui-bg-subtle shadow-sm"
          >
            {video.src ? (
              <video
                src={video.src}
                title={video.title}
                poster={video.poster}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ui-fg-muted text-sm">
                {video.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
