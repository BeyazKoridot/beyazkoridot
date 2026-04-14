'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import TopBanner from '@/components/TopBanner'
import WriteBox from '@/components/WriteBox'
import SideAd from '@/components/SideAd'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { TRENDING } from '@/lib/data'

const FILTERS = ['Tümü', 'Gündem', 'Maaş', 'Burnout', 'Kariyer', 'Anket']
const NAV_ITEMS = [
  { label: 'Ana akış', filter: 'Tümü' },
  { label: 'Maaş rehberi', filter: 'Maaş' },
  { label: 'Burnout köşesi', filter: 'Burnout' },
  { label: 'Kariyer tavsiyeleri', filter: 'Kariyer' },
  { label: 'Anketler', filter: 'Anket' },
]

const TAG_COLORS: Record<string, string> = {
  'Maaş': 'bg-red-50 text-red-800 border-red-200',
  'Kariyer değişikliği': 'bg-amber-50 text-amber-800 border-amber-200',
  'Kariyer sorunu': 'bg-orange-50 text-orange-800 border-orange-200',
  'Çalışma kültürü': 'bg-gray-100 text-gray-700 border-gray-200',
  'Burnout': 'bg-rose-50 text-rose-800 border-rose-200',
  'Anket': 'bg-gray-100 text-gray-700 border-gray-200',
}

function PostCard({ post, onLike }: { post: any; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(v => !v)
    onLike(post.id)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/post/${post.id}`
    if (navigator.share) {
      await navigator.share({ title: post.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link kopyalandı!')
    }
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const d = new Date(date)
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return `${diff}sn önce`
    if (diff < 3600) return `${Math.floor(diff/60)}dk önce`
    if (diff < 86400) return `${Math.floor(diff/3600)}sa önce`
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      onClick={() => window.location.href = `/post/${post.id}`}
      className="bg-white rounded-xl border border-ink-100 p-5 hover:border-ink-300 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${post.is_anon ? 'bg-ink-100' : 'bg-ink-900'}`}>
          {post.is_anon ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="7" r="3.5" stroke="#888" strokeWidth="1.3"/>
              <path d="M2.5 16c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          ) : (
            <span className="text-white text-[13px] font-semibold">
              {post.author_name?.slice(0, 2).toUpperCase() ?? 'Ü'}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-ink-900">
              {post.is_anon ? 'Anonim' : (post.author_name ?? 'Üye')}
            </span>
            {post.is_anon && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">gizli</span>
            )}
            {post.sector && post.sector !== 'Genel' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-900 text-white font-medium">{post.sector}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {post.level && <span className="text-[11px] text-ink-400">{post.level}</span>}
            {post.level && <span className="w-1 h-1 rounded-full bg-ink-300 inline-block" />}
            <span className="text-[11px] text-ink-400">{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </div>

      <h2 className="text-[14px] font-semibold text-ink-900 leading-snug mb-2">{post.title}</h2>
      {post.content && (
        <p className="text-[12px] text-ink-500 leading-relaxed mb-3 line-clamp-2">{post.content}</p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-ink-50">
        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${TAG_COLORS[post.tag] ?? 'bg-ink-100 text-ink-600 border-ink-200'}`}>
          {post.tag}
        </span>
        <div className="flex-1" />
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border transition-colors ${liked ? 'bg-red-50 text-red-600 border-red-200' : 'text-ink-400 border-ink-100 hover:bg-ink-50'}`}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2">
            <path d="M6.5 11S1 7.5 1 4a2.5 2.5 0 015 0 2.5 2.5 0 015 0c0 3.5-5.5 7-5.5 7z"/>
          </svg>
          {(post.vote_count ?? 0) + (liked ? 1 : 0)}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = `/post/${post.id}` }}
          className="flex items-center gap-1 text-[12px] text-ink-400 px-2.5 py-1 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M11.5 1h-10a1 1 0 00-1 1v6a1 1 0 001 1h3l2 2 2-2h3a1 1 0 001-1V2a1 1 0 00-1-1z"/>
          </svg>
          {post.comment_count ?? 0}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center text-[12px] text-ink-400 px-2.5 py-1 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="10.5" cy="2.5" r="1.5"/><circle cx="10.5" cy="10.5" r="1.5"/><circle cx="2.5" cy="6.5" r="1.5"/>
            <path d="M4 6.5l5.5-4M4 6.5l5.5 4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('Tümü')
  const [activeSector, setActiveSector] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const handleLike = async (id: string) => {
    await supabase.from('posts').update({ vote_count: posts.find(p => p.id === id)?.vote_count + 1 }).eq('id', id)
  }

  const filteredPosts = posts.filter(post => {
    if (activeSector) return post.sector === activeSector
    if (activeFilter === 'Tümü') return true
    if (activeFilter === 'Anket') return post.type === 'poll'
    if (activeFilter === 'Maaş') return post.tag === 'Maaş'
    if (activeFilter === 'Burnout') return post.tag === 'Çalışma kültürü' || post.tag === 'Burnout'
    if (activeFilter === 'Kariyer') return post.tag === 'Kariyer değişikliği' || post.tag === 'Kariyer sorunu'
    if (activeFilter === 'Gündem') return post.vote_count > 50
    return true
  })

  return (
    <>
      <TopBanner label="Sponsorlu" headline="Kariyer koçluğu — ücretsiz ilk seans" sub="Beyaz yaka profesyonelleri için 1:1 mentorluk" cta="Başvur" variant="brand" />
      <Navbar onFilterChange={(f) => { setActiveFilter(f); setActiveSector(null) }} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-6">

          <aside className="hidden md:block">
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <button key={item.label}
                  onClick={() => { setActiveFilter(item.filter); setActiveSector(null) }}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${activeFilter === item.filter && !activeSector ? 'bg-ink-900 text-white font-medium' : 'text-ink-600 hover:bg-ink-100'}`}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-5 pt-4 border-t border-ink-100">
              <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider px-3 mb-2">Sektörler</p>
              <nav className="space-y-0.5">
                {['Teknoloji', 'Finans', 'Pazarlama', 'Danışmanlık', 'İnsan kaynakları'].map(s => (
                  <button key={s}
                    onClick={() => { setActiveSector(activeSector === s ? null : s); setActiveFilter('Tümü') }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors ${activeSector === s ? 'bg-ink-900 text-white font-medium' : 'text-ink-500 hover:bg-ink-100'}`}>
                    {s}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button key={f}
                  onClick={() => { setActiveFilter(f); setActiveSector(null) }}
                  className={`shrink-0 text-[12px] px-3 py-1.5 rounded-full border transition-colors ${activeFilter === f && !activeSector ? 'bg-ink-900 text-white border-ink-900' : 'border-ink-200 text-ink-500 bg-white hover:border-ink-400'}`}>
                  {f}
                </button>
              ))}
            </div>

            <WriteBox onPost={fetchPosts} />

            {loading ? (
              <div className="text-center py-12 text-ink-400 text-[13px]">Yükleniyor...</div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-3">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-ink-400 text-[13px]">Bu kategoride henüz gönderi yok.</div>
            )}
          </main>

          <aside className="hidden md:block space-y-4">
            <div className="bg-white rounded-xl border border-ink-100 p-4">
              <h3 className="text-[12px] font-medium text-ink-800 mb-3">Günün trendleri</h3>
              {TRENDING.map((item, i) => (
                <div key={item.tag} className={`flex items-center justify-between py-2 ${i < TRENDING.length - 1 ? 'border-b border-ink-50' : ''}`}>
                  <span className="text-[12px] text-ink-700">{item.tag}</span>
                  <span className="text-[11px] text-ink-400">{item.count}</span>
                </div>
              ))}
            </div>
            <SideAd headline="İnsan kaynakları yazılımı arıyor musunuz?" sub="500+ şirket tarafından kullanılan HRMS çözümü." cta="Ücretsiz demo al" label="Reklam" />
          </aside>

        </div>
      </div>
      <Footer />
    </>
  )
}