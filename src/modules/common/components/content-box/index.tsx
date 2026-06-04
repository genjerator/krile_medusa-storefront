import { ReactNode } from "react"

type ContentBoxProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  aspectRatio?: "video" | "square" | "auto"
  className?: string
}

export default function ContentBox({
  title,
  subtitle,
  children,
  aspectRatio = "auto",
  className = "",
}: ContentBoxProps) {
  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : ""

  return (
    <div className={`rounded-lg border border-ui-border-base bg-white shadow-sm overflow-hidden ${className}`}>
      <div className={`w-full bg-ui-bg-subtle ${aspectClass}`}>
        {children}
      </div>
      {(title || subtitle) && (
        <div className="px-4 py-3">
          {title && <p className="text-sm font-medium text-ui-fg-base">{title}</p>}
          {subtitle && <p className="text-xs text-ui-fg-muted mt-0.5">{subtitle}</p>}
        </div>
      )}
    </div>
  )
}
