import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, phone, age, city, occupation, motivation, how_did_you_hear } = body

    if (!full_name || !email || !age || !city || !motivation || !how_did_you_hear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if email already exists
    const { data: existingMember } = await supabase.from("community_members").select("id").eq("email", email).single()

    if (existingMember) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("community_members")
      .insert({
        full_name,
        email,
        phone,
        age: Number.parseInt(age),
        city,
        occupation,
        motivation,
        how_did_you_hear,
        is_approved: false, // Requires admin approval
        joined_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
