import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import CurhatManagement from "@/components/admin/curhat-management"

export default async function AdminCurhatPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all curhat stories from API
  let stories = []
  try {
    const response = await fetch('/api/curhat?limit=1000', {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      stories = data.data || []
    }
  } catch (error) {
    console.error("Error fetching stories:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <CurhatManagement initialStories={stories} />
    </div>
  )
}
