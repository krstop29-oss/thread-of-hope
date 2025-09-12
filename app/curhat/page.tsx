import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CurhatList from "@/components/curhat-list"
import StoryForm from "@/components/story-form"

export default async function CurhatPage() {
  const supabase = await createClient()

  // Fetch approved curhat stories
  const { data: stories, error } = await supabase
    .from("curhat")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stories:", error)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">Curhat</span> & Berbagi Cerita
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ruang aman untuk berbagi cerita, pengalaman, dan perasaan. Mari saling mendengar dan memberikan dukungan.
          </p>
        </div>
      </section>

      {/* Story Form Section */}
      <StoryForm />

      {/* Stories List */}
      <CurhatList initialStories={stories || []} />

      <Footer />
    </main>
  )
}
