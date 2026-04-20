import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Test Page",
  description: "A test page with dummy content.",
}

export default function TestPage() {
  return (
    <div className="content-container py-12">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {["Card One", "Card Two", "Card Three"].map((title, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-500 text-sm">
              This is dummy content for {title.toLowerCase()}. It serves as a
              placeholder to verify the route is working correctly.
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">About This Page</h2>
        <p className="text-gray-600 mb-2">
          This is a test route at <code className="bg-gray-200 px-1 rounded">/test</code>.
          It was added to verify the Next.js App Router setup is working as expected.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Next.js 15 App Router</li>
          <li>Medusa Storefront</li>
          <li>Tailwind CSS styling</li>
        </ul>
      </div>
    </div>
  )
}
