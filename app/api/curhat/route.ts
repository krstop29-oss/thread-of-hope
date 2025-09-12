import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, usia, harapan, cerita } = body

    if (!nama || !usia || !harapan || !cerita) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("curhat")
      .insert({
        title: harapan,
        content: cerita,
        author_name: nama,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to submit story" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const approved = searchParams.get("approved") !== "false"

    const supabase = await createClient()

    let query = supabase.from("curhat").select("*", { count: "exact" }).order("created_at", { ascending: false })

    if (approved) {
      query = query.eq("is_approved", true)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
