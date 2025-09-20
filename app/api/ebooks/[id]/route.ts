import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const ebook = await prisma.ebook.findFirst({
      where: {
        id,
        isPublished: true,
      },
    })

    if (!ebook) {
      return NextResponse.json({ error: "E-book not found" }, { status: 404 })
    }

    return NextResponse.json({ data: ebook })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch ebook" }, { status: 500 })
  }
}