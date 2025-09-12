import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
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

  // Fetch dashboard stats
  const [{ count: pendingCurhat }, { count: totalEbooks }, { count: totalGallery }, { count: totalMembers }] =
    await Promise.all([
      supabase.from("curhat").select("*", { count: "exact", head: true }).eq("is_approved", false),
      supabase.from("ebooks").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("community_members").select("*", { count: "exact", head: true }),
    ])

  const stats = {
    pendingCurhat: pendingCurhat || 0,
    totalEbooks: totalEbooks || 0,
    totalGallery: totalGallery || 0,
    totalMembers: totalMembers || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={data.user} />
      <AdminDashboard stats={stats} />
    </div>
  )
}
