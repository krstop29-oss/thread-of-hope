import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import CurhatManagement from "@/components/admin/curhat-management"

export default async function AdminCurhatPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", data.user.id).single()

  if (!adminUser) {
    redirect("/")
  }

  // Fetch all curhat stories
  const { data: stories } = await supabase.from("curhat").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={data.user} />
      <CurhatManagement initialStories={stories || []} />
    </div>
  )
}
