import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  const tags = request.nextUrl.searchParams.get("tags")

  if (!tags) {
    return NextResponse.json({ message: "No tags provided" }, { status: 400 })
  }

  const tagList = tags.split(",").map((t) => t.trim())
  tagList.forEach((tag) => revalidateTag(tag))
  console.log(`[revalidate] tags cleared: ${tagList.join(", ")}`)

  return NextResponse.json({ revalidated: true, tags: tagList })
}
