import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CurhatList from "@/components/curhat-list"
import StoryForm from "@/components/story-form"

export default async function CurhatPage() {
  // Fetch approved curhat stories from API
  let stories = []
  try {
    const response = await fetch('/api/curhat?approved=true&limit=50', {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      stories = data.data || []
    }
  } catch (error) {
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
      <CurhatList initialStories={stories} />

      <Footer />
    </main>
  )
}
