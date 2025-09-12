"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if user is admin
        const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()
        setIsAdmin(!!adminUser)
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button onClick={() => router.push("/admin")} variant="outline" size="sm">
            Admin Panel
          </Button>
        )}
        <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
        <Button onClick={handleSignOut} variant="destructive" size="sm">
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => router.push("/auth/login")} variant="default" size="sm">
        Login
      </Button>
      <Button onClick={() => router.push("/auth/sign-up")} variant="outline" size="sm">
        Sign Up
      </Button>
    </div>
  )
}
