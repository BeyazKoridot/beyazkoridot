import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: company } = await supabase
    .from('companies')
    .select('name, description, sector')
    .eq('slug', params.slug)
    .single()

  if (!company) return {}

  const title = `${company.name} Çalışan Yorumları ve Deneyimleri | OTR Social`
  const description = `${company.name} hakkında anonim çalışan yorumları, maaş bilgileri ve iş kültürü değerlendirmeleri. OTR Social'da gerçek deneyimleri keşfet.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function SirketPage({ params }: { params: { slug: string } }) {
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!company) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, content, tag, created_at')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const allPosts = posts ?? []

  const tagCounts: Record<string, number> = {}
  allPosts.forEach(p => { if (p.tag) tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1 })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.description ?? `${company.name} çalışan yorumları ve deneyimleri`,
    url: `https://www.otrsocial.com/sirketler/${company.slug}`,
    ...(allPosts.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.0',
        reviewCount: allPosts.length,
      },
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <a href="/sirketler" className="text-[13px] text-ink-400 hover:text-ink-700 mb-6 block">← Tüm şirketler</a>

        <div className="bg-white rounded-xl border border-ink-100 p-6 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-[22px] font-semibold text-ink-900">{company.name}</h1>
              {company.sector && <p className="text-[13px] text-ink-400 mt-0.5">{company.sector}</p>}
            </div>
            {company.is_verified && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">✓ Doğrulandı</span>
            )}
          </div>

          {company.description && (
            <p className="text-[13px] text-ink-600 leading-relaxed mb-4">{company.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-[12px] text-ink-400 mb-5">
            {company.employee_count && <span>👥 {company.employee_count} çalışan</span>}
            {company.founded_year && <span>📅 {company.founded_year} yılından beri</span>}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-ink-600 hover:underline">
                🔗 Web sitesi
              </a>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-ink-50 rounded-lg p-3 text-center">
              <p className="text-[20px] font-semibold text-ink-900">{allPosts.length}</p>
              <p className="text-[11px] text-ink-400 mt-0.5">Paylaşım</p>
            </div>
            <div className="bg-ink-50 rounded-lg p-3 text-center">
              <p className="text-[20px] font-semibold text-ink-900">{allPosts.filter(p => p.tag === 'Maaş').length}</p>
              <p className="text-[11px] text-ink-400 mt-0.5">Maaş verisi</p>
            </div>
            <div className="bg-ink-50 rounded-lg p-3 text-center">
              <p className="text-[20px] font-semibold text-ink-900">{Object.keys(tagCounts).length}</p>
              <p className="text-[11px] text-ink-400 mt-0.5">Konu</p>
            </div>
          </div>

          {Object.keys(tagCounts).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(tagCounts).map(([tag, count]) => (
                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-ink-100 text-ink-600">
                  {tag} ({count})
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3 px-1">
          <h2 className="text-[14px] font-medium text-ink-700">{allPosts.length} paylaşım</h2>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-ink-100">
            <p className="text-[14px] font-medium text-ink-700 mb-1">Henüz paylaşım yok</p>
            <p className="text-[12px] text-ink-400">{company.name} hakkında ilk deneyimi sen paylaş.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allPosts.map(p => (
              <a key={p.id} href={'/post/' + p.id} className="block bg-white rounded-xl border border-ink-100 p-4 hover:border-ink-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  {p.tag && <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">{p.tag}</span>}
                  <span className="text-[11px] text-ink-300">{new Date(p.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h3 className="text-[14px] font-medium text-ink-900 leading-snug">{p.title}</h3>
                {p.content && <p className="text-[12px] text-ink-500 mt-1 line-clamp-2">{p.content}</p>}
              </a>
            ))}
          </div>
        )}

        <div className="mt-6 px-4 py-3 bg-ink-50 rounded-lg border border-ink-100">
          <p className="text-[11px] text-ink-400 leading-relaxed">
            Bu sayfadaki içerikler kullanıcılar tarafından anonim olarak paylaşılmıştır. Platform doğruluğunu taahhüt etmez.
            İçerik şikayeti için{' '}
            <a href="mailto:info@otrsocial.com" className="underline">info@otrsocial.com</a>{' '}
            adresine yazabilirsiniz.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
