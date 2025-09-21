import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminNavbar from "@/components/admin/admin-navbar"
import GalleryManagement from "@/components/admin/gallery-management"

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect("/")
  }

  // Fetch all gallery items from API
  let galleryItems = []
  try {
    const response = await fetch('/api/gallery?limit=1000', {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      galleryItems = data.data || []
    }
  } catch (error) {
    console.error("Error fetching gallery items:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={session.user} />
      <GalleryManagement initialGalleryItems={galleryItems} />
    </div>
  )
}