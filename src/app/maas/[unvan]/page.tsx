import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Slug → DB değeri eşleşmesi
const UNVAN_MAP: Record<string, string> = {
  'senior': 'Senior',
  'junior': 'Junior',
  'mid-level': 'Mid-level',
  'lead': 'Lead',
  'manager': 'Manager',
  'director': 'Director',
  'stajyer': 'Stajyer',
  'c-level': 'C-level',
}

const SEKTOR_LABEL: Record<string, string> = {
  'Teknoloji': 'Teknoloji',
  'Finans': 'Finans',
  'Pazarlama': 'Pazarlama',
  'Danismanlik': 'Danışmanlık',
  'Insan kaynaklari': 'İnsan Kaynakları',
  'E-ticaret': 'E-ticaret',
  'Medya': 'Medya',
  'Hukuk': 'Hukuk',
  'Diger': 'Diğer',
}

export async function generateStaticParams() {
  return Object.keys(UNVAN_MAP).map((slug) => ({ unvan: slug }))
}

export async function generateMetadata({ params }: { params: { unvan: string } }) {
  const unvanLabel = UNVAN_MAP[params.unvan]
  if (!unvanLabel) return { title: 'Sayfa bulunamadı | OTR Social' }

  return {
    title: `${unvanLabel} Maaşları — Türkiye Ortalamaları | OTR Social`,
    description: `Türkiye'de ${unvanLabel} pozisyonunda çalışanların anonim maaş verileri. Sektör ve şehir bazlı ortalamalar, gerçek çalışan paylaşımları.`,
    openGraph: {
      title: `${unvanLabel} Maaşları | OTR Social`,
      description: `${unvanLabel} maaş ortalamaları — sektör bazlı karşılaştırma.`,
      url: `https://otrsocial.com/maas/${params.unvan}`,
    },
    alternates: {
      canonical: `https://otrsocial.com/maas/${params.unvan}`,
    },
  }
}

export default async function UnvanMaasPage({ params }: { params: { unvan: string } }) {
  const unvanLabel = UNVAN_MAP[params.unvan]
  if (!unvanLabel) notFound()

  const { data: salaries } = await supabase
    .from('salary_data')
    .select('maas, sektor, sehir, yil_deneyim, created_at')
    .eq('unvan', unvanLabel)
    .order('created_at', { ascending: false })

  const data = salaries ?? []

  // İstatistikler
  const avg = data.length > 0 ? Math.round(data.reduce((a, s) => a + s.maas, 0) / data.length) : 0
  const sorted = [...data].sort((a, b) => a.maas - b.maas)
  const min = sorted[0]?.maas ?? 0
  const max = sorted[sorted.length - 1]?.maas ?? 0
  const median = sorted[Math.floor(sorted.length / 2)]?.maas ?? 0

  // Sektör kırılımı
  const sektorMap: Record<string, number[]> = {}
  data.forEach(s => {
    if (!s.sektor) return
    if (!sektorMap[s.sektor]) sektorMap[s.sektor] = []
    sektorMap[s.sektor].push(s.maas)
  })
  const sektorStats = Object.entries(sektorMap)
    .map(([sektor, values]) => ({
      sektor,
      label: SEKTOR_LABEL[sektor] ?? sektor,
      avg: Math.round(values.reduce((a, v) => a + v, 0) / values.length),
      count: values.length,
    }))
    .sort((a, b) => b.avg - a.avg)

  // Diğer unvanlar (ilgili linkler)
  const digerUnvanlar = Object.entries(UNVAN_MAP).filter(([slug]) => slug !== params.unvan)

  const fmt = (n: number) => n.toLocaleString('tr-TR') + ' TL'
  const yeterliVeri = data.length >= 3

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${unvanLabel} Maaş Verileri — Türkiye`,
    description: `Türkiye'de ${unvanLabel} pozisyonunda anonim çalışan maaş verileri`,
    url: `https://otrsocial.com/maas/${params.unvan}`,
    creator: { '@type': 'Organization', name: 'OTR Social', url: 'https://otrsocial.com' },
    ...(yeterliVeri ? {
      measurementTechnique: 'Anonim kullanıcı bildirimi',
      variableMeasured: 'Aylık net maaş (TL)',
    } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-ink-400 mb-6">
          <a href="/maas" className="hover:text-ink-700">Maaş Rehberi</a>
          <span>›</span>
          <span className="text-ink-700">{unvanLabel}</span>
        </div>

        <h1 className="text-[24px] font-semibold text-ink-900 mb-1">{unvanLabel} Maaşları</h1>
        <p className="text-[13px] text-ink-400 mb-6">
          Türkiye genelinde {unvanLabel} pozisyonundaki çalışanların anonim maaş verileri · {data.length} kayıt
        </p>

        {/* İstatistik kartları */}
        {yeterliVeri ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Ortalama', value: fmt(avg) },
              { label: 'Medyan', value: fmt(median) },
              { label: 'En düşük', value: fmt(min) },
              { label: 'En yüksek', value: fmt(max) },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-ink-100 p-4 text-center">
                <p className="text-[11px] text-ink-400 mb-1">{m.label}</p>
                <p className="text-[16px] font-semibold text-ink-900">{m.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-[13px] text-amber-800">
            Henüz yeterli veri yok ({data.length} kayıt). İstatistikler için en az 3 veri gerekiyor.
          </div>
        )}

        {/* Sektör kırılımı */}
        {sektorStats.length > 0 && (
          <div className="bg-white rounded-xl border border-ink-100 p-5 mb-6">
            <h2 className="text-[14px] font-medium text-ink-700 mb-4">Sektör bazlı ortalama maaş</h2>
            <div className="space-y-3">
              {sektorStats.map(s => {
                const pct = avg > 0 ? Math.min(Math.round((s.avg / (max || avg)) * 100), 100) : 50
                return (
                  <div key={s.sektor}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-ink-700">{s.label}</span>
                      <span className="text-[12px] font-medium text-ink-900">{fmt(s.avg)}
                        <span className="text-ink-400 font-normal ml-1">({s.count} veri)</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-ink-100 rounded-full">
                      <div className="h-1.5 bg-ink-800 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Diğer unvanlar */}
        <div className="bg-white rounded-xl border border-ink-100 p-5 mb-6">
          <h2 className="text-[14px] font-medium text-ink-700 mb-3">Diğer unvan maaşları</h2>
          <div className="flex flex-wrap gap-2">
            {digerUnvanlar.map(([slug, label]) => (
              <a key={slug} href={`/maas/${slug}`}
                className="text-[12px] px-3 py-1.5 rounded-full border border-ink-200 text-ink-600 hover:border-ink-800 hover:text-ink-900 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Yasal uyarı */}
        <div className="px-4 py-3 bg-ink-50 rounded-lg border border-ink-100">
          <p className="text-[11px] text-ink-400 leading-relaxed">
            Veriler kullanıcılar tarafından anonim olarak paylaşılmıştır. OTR Social doğruluğu garanti etmez.
            Maaş eklemek için <a href="/maas" className="underline">Maaş Rehberi</a> sayfasını ziyaret et.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
