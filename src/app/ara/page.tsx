'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AraPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    setResults(data ?? [])
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-[20px] font-bold text-ink-900 mb-4">Ara</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Başlık veya konu ara..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400 bg-white"
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-ink-900 text-white text-[13px] font-medium hover:bg-ink-700 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Ara'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 text-ink-400 text-[13px]">Aranıyor...</div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-8 text-ink-400 text-[13px]">
            "{query}" için sonuç bulunamadı.
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-[12px] text-ink-400">{results.length} sonuç bulundu</p>
            {results.map(post => (
              <div
                key={post.id}
                onClick={() => window.location.href = `/post/${post.id}`}
                className="bg-white rounded-xl border border-ink-100 p-4 hover:border-ink-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  {post.sector && post.sector !== 'Genel' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-900 text-white font-medium">{post.sector}</span>
                  )}
                  <span className="text-[11px] text-ink-400">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h2 className="text-[14px] font-medium text-ink-900 leading-snug mb-1">{post.title}</h2>
                {post.content && (
                  <p className="text-[12px] text-ink-500 line-clamp-2">{post.content}</p>
                )}
                <div className="mt-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{post.tag}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searched && (
          <div className="text-center py-12">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#ccc" strokeWidth="2" className="mx-auto mb-3">
              <circle cx="18" cy="18" r="12"/><path d="M28 28l8 8" strokeLinecap="round"/>
            </svg>
            <p className="text-[13px] text-ink-400">Konu, başlık veya sektör ara</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
