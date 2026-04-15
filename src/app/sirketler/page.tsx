'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SirketlerPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('companies')
      .select('*, posts(count)')
      .eq('is_approved', true)
      .order('name')
      .then(({ data }) => {
        setCompanies(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-ink-900 mb-1">Şirket Deneyimleri</h1>
          <p className="text-[13px] text-ink-400">Türkiye şirketlerinde çalışan deneyimleri</p>
        </div>
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Şirket ara..."
            className="w-full px-4 py-2.5 text-[13px] border border-ink-200 rounded-xl outline-none focus:border-ink-400"
          />
        </div>
        {loading ? (
          <p className="text-center text-ink-400 text-[13px] py-12">Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(c => (
              <a key={c.id} href={'/sirketler/' + c.slug} className="bg-white rounded-xl border border-ink-100 p-4 hover:border-ink-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-[15px] font-medium text-ink-900">{c.name}</h2>
                    {c.sector && <span className="text-[11px] text-ink-400">{c.sector}</span>}
                  </div>
                  {c.is_verified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">✓</span>}
                </div>
                <span className="text-[12px] text-ink-500">{c.posts?.[0]?.count ?? 0} paylaşım</span>
              </a>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <p className="text-[13px] text-ink-400">Şirket bulunamadı</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}