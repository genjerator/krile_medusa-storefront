import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <div className="w-2/5 h-6 bg-gray-100 mb-2"></div>
      <Container className="aspect-[9/16] w-full bg-gray-100 bg-ui-bg-subtle" />
      <div className="w-1/5 h-6 bg-gray-100 mt-4"></div>
    </div>
  )
}

export default SkeletonProductPreview
