import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CurhatDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CurhatDetailPage({ params }: CurhatDetailPageProps) {
  const { id: storyId } = await params
  const supabase = await createClient()

  const { data: story, error } = await supabase
    .from("curhat")
    .select("*")
    .eq("id", storyId)
    .eq("is_approved", true)
    .single()

  if (error || !story) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/curhat" className="inline-flex items-center text-primary hover:text-secondary mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Curhat
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/thread of hope/images/icon profile.png"
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">{story.author_name}</h2>
                <p className="text-muted-foreground">
                  {formatDistanceToNow(new Date(story.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <h1 className="text-3xl font-bold text-card-foreground">{story.title}</h1>

            <div className="prose prose-lg prose-gray max-w-none">
              <p className="text-card-foreground leading-relaxed whitespace-pre-wrap text-lg">{story.content}</p>
            </div>

            <div className="flex items-center space-x-6 pt-6 border-t border-border">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <Heart className="w-5 h-5 mr-2" />
                Dukung Cerita Ini
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Berikan Komentar
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <Share2 className="w-5 h-5 mr-2" />
                Bagikan Cerita
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Stories Section */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">Cerita Lainnya</h3>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Fitur cerita terkait akan segera hadir...</p>
            <Link href="/curhat" className="inline-block mt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-secondary">Lihat Semua Cerita</Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
