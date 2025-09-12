import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
                <span className="text-primary">CERITA KAMU</span>
                <div className="flex items-center gap-4 mt-2">
                  <Image
                    src="/thread of hope/images/payung-geulis.png"
                    alt="Payung Geulis"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">SUARA YANG BERARTI</h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Berbagi adalah langkah kecil menuju pemulihan. Sampaikan ceritamu, biarkan orang lain terinspirasi, dan
              mari bersama-sama membangun ruang yang sehat untuk mental kita.
            </p>

            <Link
              href="#form-cerita"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-secondary transition-colors shadow-lg"
            >
              Tulis Cerita
            </Link>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/thread of hope/images/foto-landing-page.png"
              alt="Foto Landing Page"
              width={500}
              height={400}
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
