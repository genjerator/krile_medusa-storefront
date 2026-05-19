import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const tags = request.nextUrl.searchParams.get("tags") ?? "products"

  const tagList = tags.split(",").map((t) => t.trim())
  tagList.forEach((tag) => revalidateTag(tag))

  revalidatePath("/", "layout")

  console.log(`[revalidate] tags cleared: ${tagList.join(", ")} + layout revalidated`)

  return NextResponse.json({ revalidated: true, tags: tagList })
}
