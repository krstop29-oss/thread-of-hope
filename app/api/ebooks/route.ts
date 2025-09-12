import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const published = searchParams.get("published") !== "false"

    const supabase = await createClient()

    let query = supabase.from("ebooks").select("*", { count: "exact" }).order("created_at", { ascending: false })

    if (published) {
      query = query.eq("is_published", true)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch ebooks" }, { status: 500 })
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, author, category, cover_image_url, file_url } = body

    if (!title || !description || !author || !category || !file_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("ebooks")
      .insert({
        title,
        description,
        author,
        category,
        cover_image_url,
        file_url,
        is_published: false,
        download_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create ebook" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
