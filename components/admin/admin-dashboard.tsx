import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BookOpen, ImageIcon, Users, Eye, Plus, Settings } from "lucide-react"

interface AdminDashboardProps {
  stats: {
    pendingCurhat: number
    totalEbooks: number
    totalGallery: number
    totalMembers: number
  }
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const statCards = [
    {
      title: "Pending Curhat",
      value: stats.pendingCurhat,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/curhat",
    },
    {
      title: "E-Books",
      value: stats.totalEbooks,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/admin/ebooks",
    },
    {
      title: "Gallery Items",
      value: stats.totalGallery,
      icon: ImageIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/gallery",
    },
    {
      title: "Community Members",
      value: stats.totalMembers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/members",
    },
  ]

  const quickActions = [
    {
      title: "Review Curhat Stories",
      description: "Approve or reject pending story submissions",
      icon: Eye,
      href: "/admin/curhat",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Add New E-Book",
      description: "Upload and manage e-book resources",
      icon: Plus,
      href: "/admin/ebooks/new",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Manage Gallery",
      description: "Upload and organize gallery images",
      icon: ImageIcon,
      href: "/admin/gallery",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "View Members",
      description: "Manage community member list",
      icon: Users,
      href: "/admin/members",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage Thread of Hope platform content and community</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-md text-white ${action.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Activity tracking will be implemented in future updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
