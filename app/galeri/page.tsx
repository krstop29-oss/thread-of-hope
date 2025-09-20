import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const Calendar = dynamic(() => import('@/components/calendar'), { ssr: false })

export default async function GaleriPage() {
  // Fetch upcoming events from API (placeholder for now)
  let eventsList: any[] = []

  try {
    // TODO: Create API endpoint for events
    // const response = await fetch('/api/events?upcoming=true&limit=10')
    // if (response.ok) {
    //   const data = await response.json()
    //   eventsList = data.data || []
    // }
  } catch (error) {
    console.error('Error fetching events for gallery:', error)
  }

  const serialized = eventsList.map((e: any) => ({
    id: String(e.id),
    title: e.title ?? '',
    event_date: new Date(e.event_date).toISOString(),
    location: e.location ?? '',
  }))

  const photos = [
    { src: '/images/kegiatan-kemanusiaan-mental-health-2.jpg', caption: 'Workshop Kesehatan Mental' },
    { src: '/images/foto-landing-page.png', caption: 'Seminar Inspiratif' },
    { src: '/images/kegiatan-kemanusiaan-mental-health-2.jpg', caption: 'Grup Diskusi Remaja' },
    { src: '/images/foto-landing-page.png', caption: 'Sesi Berbagi Cerita' },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Galeri Kegiatan</h2>
            <p className="mt-2 text-muted-foreground">Momen kebersamaan yang telah kami lalui untuk merajut harapan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {photos.map((p, i) => (
              <div key={i} className="bg-white rounded shadow overflow-hidden">
                <Image src={p.src} alt={p.caption} width={600} height={400} className="object-cover w-full h-48" />
                <div className="p-3">
                  <div className="font-semibold">{p.caption}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">Kalender Event</h3>
            <div className="bg-white p-6 rounded shadow">
              {eventsList.length === 0 ? (
                <p className="text-muted-foreground">Belum ada event yang dijadwalkan.</p>
              ) : (
                <div>
                  {/* Calendar is client-side only */}
                  <div className="max-w-md">
                    <Calendar events={serialized} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
