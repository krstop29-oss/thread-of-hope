import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import EventManagement from "@/components/admin/event-management"

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all events from API
  let events = []
  try {
    const response = await fetch('http://localhost:3000/api/events?limit=1000', {
      cache: 'force-cache',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    if (response.ok) {
      const data = await response.json()
      events = data.data || []
    }
  } catch (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <EventManagement initialEvents={events} />
    </div>
  )
}