import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import MemberManagement from "@/components/admin/member-management"

export default async function AdminMembersPage() {
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

  // Fetch all community members
  const { data: members } = await supabase
    .from("community_members")
    .select("*")
    .order("joined_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={data.user} />
      <MemberManagement initialMembers={members || []} />
    </div>
  )
}
