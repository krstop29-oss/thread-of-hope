"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search, BookOpen, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface Ebook {
  id: string
  title: string
  description: string
  author: string
  category: string
  cover_image_url: string | null
  file_url: string
  download_count: number
  created_at: string
}

interface EbookGridProps {
  initialEbooks: Ebook[]
}

export default function EbookGrid({ initialEbooks }: EbookGridProps) {
  const [ebooks, setEbooks] = useState<Ebook[]>(initialEbooks)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(ebooks.map((ebook) => ebook.category)))]

  // Filter ebooks based on search and category
  const filteredEbooks = ebooks.filter((ebook) => {
    const matchesSearch =
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleDownload = async (ebookId: string, fileUrl: string) => {
    try {
      // Increment download count
      await fetch(`/api/ebooks/${ebookId}/download`, {
        method: "POST",
      })

      // Update local state
      setEbooks(
        ebooks.map((ebook) => (ebook.id === ebookId ? { ...ebook, download_count: ebook.download_count + 1 } : ebook)),
      )

      // Open download link
      window.open(fileUrl, "_blank")
    } catch (error) {
      console.error("Error downloading ebook:", error)
    }
  }

  return (
    <section className="bg-card py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari e-book berdasarkan judul, penulis, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "Semua Kategori" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Menampilkan {filteredEbooks.length} dari {ebooks.length} e-book
          </p>
        </div>

        {/* E-books Grid */}
        {filteredEbooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEbooks.map((ebook) => (
              <Card key={ebook.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    {ebook.cover_image_url ? (
                      <Image
                        src={ebook.cover_image_url || "/placeholder.svg"}
                        alt={ebook.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">{ebook.category}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2">{ebook.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">oleh {ebook.author}</p>
                    <p className="text-card-foreground line-clamp-3 leading-relaxed">{ebook.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(ebook.created_at), { addSuffix: true, locale: id })}
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {ebook.download_count} unduhan
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/ebook/${ebook.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDownload(ebook.id, ebook.file_url)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-secondary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Tidak ada e-book ditemukan</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "Coba ubah kata kunci pencarian atau filter kategori"
                : "Belum ada e-book yang tersedia saat ini"}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
