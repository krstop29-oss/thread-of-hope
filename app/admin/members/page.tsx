import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import MemberManagement from "@/components/admin/member-management"

export default async function AdminMembersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all community members from API
  let members = []
  try {
    const response = await fetch('/api/community?limit=1000', {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      members = data.data || []
    }
  } catch (error) {
    console.error("Error fetching members:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <MemberManagement initialMembers={members} />
    </div>
  )
}
