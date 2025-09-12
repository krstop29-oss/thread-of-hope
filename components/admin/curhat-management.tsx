"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Eye, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CurhatStory {
  id: string
  title: string
  content: string
  author_name: string
  is_approved: boolean
  created_at: string
}

interface CurhatManagementProps {
  initialStories: CurhatStory[]
}

export default function CurhatManagement({ initialStories }: CurhatManagementProps) {
  const [stories, setStories] = useState<CurhatStory[]>(initialStories)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleApprove = async (storyId: string) => {
    setLoading(storyId)
    try {
      const response = await fetch(`/api/curhat/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      })

      if (response.ok) {
        setStories(stories.map((story) => (story.id === storyId ? { ...story, is_approved: true } : story)))
      }
    } catch (error) {
      console.error("Error approving story:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (storyId: string) => {
    setLoading(storyId)
    try {
      const response = await fetch(`/api/curhat/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: false }),
      })

      if (response.ok) {
        setStories(stories.map((story) => (story.id === storyId ? { ...story, is_approved: false } : story)))
      }
    } catch (error) {
      console.error("Error rejecting story:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return

    setLoading(storyId)
    try {
      const response = await fetch(`/api/curhat/${storyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStories(stories.filter((story) => story.id !== storyId))
      }
    } catch (error) {
      console.error("Error deleting story:", error)
    } finally {
      setLoading(null)
    }
  }

  const pendingStories = stories.filter((story) => !story.is_approved)
  const approvedStories = stories.filter((story) => story.is_approved)

  const StoryCard = ({ story }: { story: CurhatStory }) => (
    <Card key={story.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{story.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              By {story.author_name} •{" "}
              {formatDistanceToNow(new Date(story.created_at), { addSuffix: true, locale: id })}
            </p>
          </div>
          <Badge variant={story.is_approved ? "default" : "secondary"}>
            {story.is_approved ? "Approved" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground mb-4 line-clamp-3">{story.content}</p>

        <div className="flex items-center space-x-2">
          {!story.is_approved && (
            <Button
              size="sm"
              onClick={() => handleApprove(story.id)}
              disabled={loading === story.id}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}

          {story.is_approved && (
            <Button size="sm" variant="outline" onClick={() => handleReject(story.id)} disabled={loading === story.id}>
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={() => window.open(`/curhat/${story.id}`, "_blank")}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(story.id)}
            disabled={loading === story.id}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Curhat Management</h1>
        <p className="text-muted-foreground mt-2">Review and manage story submissions from the community</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingStories.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedStories.length})</TabsTrigger>
          <TabsTrigger value="all">All Stories ({stories.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingStories.length > 0 ? (
            pendingStories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No pending stories to review</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedStories.length > 0 ? (
            approvedStories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No approved stories yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          {stories.length > 0 ? (
            stories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No stories submitted yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
