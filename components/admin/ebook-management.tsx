"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, Trash2, Plus, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Ebook {
  id: string
  title: string
  description: string
  author: string
  category: string
  coverImageUrl: string | null
  fileUrl: string
  isPublished: boolean
  downloadCount: number
  createdAt: string
}

interface EbookManagementProps {
  initialEbooks: Ebook[]
}

export default function EbookManagement({ initialEbooks }: EbookManagementProps) {
  const [ebooks, setEbooks] = useState<Ebook[]>(initialEbooks)
  const [loading, setLoading] = useState<string | null>(null)

  const handleTogglePublish = async (ebookId: string, currentStatus: boolean) => {
    setLoading(ebookId)
    try {
      const response = await fetch(`/api/ebooks/${ebookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })

      if (response.ok) {
        setEbooks(ebooks.map((ebook) => (ebook.id === ebookId ? { ...ebook, isPublished: !currentStatus } : ebook)))
      }
    } catch (error) {
      console.error("Error toggling publish status:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (ebookId: string) => {
    if (!confirm("Are you sure you want to delete this e-book?")) return

    setLoading(ebookId)
    try {
      const response = await fetch(`/api/ebooks/${ebookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEbooks(ebooks.filter((ebook) => ebook.id !== ebookId))
      }
    } catch (error) {
      console.error("Error deleting ebook:", error)
    } finally {
      setLoading(null)
    }
  }

  const publishedEbooks = ebooks.filter((ebook) => ebook.isPublished)
  const draftEbooks = ebooks.filter((ebook) => !ebook.isPublished)

  const EbookCard = ({ ebook }: { ebook: Ebook }) => (
    <Card key={ebook.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-20 h-28 flex-shrink-0">
            {ebook.coverImageUrl ? (
              <Image
                src={ebook.coverImageUrl || "/placeholder.svg"}
                alt={ebook.title}
                width={80}
                height={112}
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No Cover</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{ebook.title}</h3>
                <p className="text-sm text-muted-foreground">by {ebook.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={ebook.isPublished ? "default" : "secondary"}>
                  {ebook.isPublished ? "Published" : "Draft"}
                </Badge>
                <Badge variant="outline">{ebook.category}</Badge>
              </div>
            </div>

            <p className="text-card-foreground mb-3 line-clamp-2">{ebook.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  {ebook.downloadCount} downloads
                </div>
                <span>{formatDistanceToNow(new Date(ebook.createdAt), { addSuffix: true, locale: id })}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => window.open(ebook.fileUrl, "_blank")}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>

                <Button
                  size="sm"
                  variant={ebook.isPublished ? "secondary" : "default"}
                  onClick={() => handleTogglePublish(ebook.id, ebook.isPublished)}
                  disabled={loading === ebook.id}
                >
                  {ebook.isPublished ? "Unpublish" : "Publish"}
                </Button>

                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(ebook.id)}
                  disabled={loading === ebook.id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">E-Book Management</h1>
          <p className="text-muted-foreground mt-2">Manage your e-book library and publications</p>
        </div>
        <Link href="/admin/ebooks/new">
          <Button className="bg-primary text-primary-foreground hover:bg-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add New E-Book
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="published" className="space-y-6">
        <TabsList>
          <TabsTrigger value="published">Published ({publishedEbooks.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftEbooks.length})</TabsTrigger>
          <TabsTrigger value="all">All E-Books ({ebooks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          {publishedEbooks.length > 0 ? (
            publishedEbooks.map((ebook) => <EbookCard key={ebook.id} ebook={ebook} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No published e-books yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="drafts">
          {draftEbooks.length > 0 ? (
            draftEbooks.map((ebook) => <EbookCard key={ebook.id} ebook={ebook} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No draft e-books</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          {ebooks.length > 0 ? (
            ebooks.map((ebook) => <EbookCard key={ebook.id} ebook={ebook} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No e-books created yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
