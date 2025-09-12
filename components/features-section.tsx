export default function FeaturesSection() {
  const features = [
    {
      title: "Untuk Kamu yang Ingin Berbagi",
      description: "Tuliskan ceritamu dan ungkapkan perasaanmu dengan aman.",
    },
    {
      title: "Untuk Kamu yang Ingin Membaca",
      description: "Temukan kisah inspiratif dari orang lain untuk menambah semangat.",
    },
    {
      title: "Untuk Dukungan Komunitas",
      description: "Bersama-sama kita ciptakan ruang sehat penuh empati.",
    },
    {
      title: "Untuk Kegiatan & Momen",
      description: "Lihat dokumentasi kegiatan dan momen kebersamaan yang sudah kami lakukan.",
    },
  ]

  return (
    <section className="bg-card py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Apa yang kami tawarkan?</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Platform ini hadir untuk menjadi ruang aman, tempat berbagi cerita, menemukan inspirasi dari pengalaman
            orang lain, serta membangun komunitas yang saling peduli melalui cerita dan momen kebersamaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
