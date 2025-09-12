import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EbookManagement from "@/components/admin/ebook-management"

export default async function AdminEbooksPage() {
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

  // Fetch all ebooks
  const { data: ebooks } = await supabase.from("ebooks").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={data.user} />
      <EbookManagement initialEbooks={ebooks || []} />
    </div>
  )
}
