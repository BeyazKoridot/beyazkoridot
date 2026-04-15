'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import TopBanner from '@/components/TopBanner'
import WriteBox from '@/components/WriteBox'
import SideAd from '@/components/SideAd'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { TRENDING } from '@/lib/data'
import UserAvatar from '@/components/UserAvatar'

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

function PostCard({ post, onLike, onHashtagClick }: { post: any; onLike: (id: string) => void; onHashtagClick: (tag: string) => void }) {
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
    <div onClick={() => window.location.href = `/post/${post.id}`}
      className="bg-white rounded-xl border border-ink-100 p-5 hover:border-ink-300 transition-colors cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className="shrink-0">
          {post.is_anon ? (
            <UserAvatar size={40} />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-ink-900">
              <span className="text-white text-[13px] font-semibold">
                {post.author_name?.slice(0, 2).toUpperCase() ?? 'Ü'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-ink-900">
              {post.author_name ?? (post.is_anon ? 'Anonim' : 'Üye')}
            </span>
            {post.is_anon && <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">gizli</span>}
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

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.hashtags.map((tag: string) => (
            <button key={tag}
              onClick={(e) => { e.stopPropagation(); onHashtagClick(tag) }}
              className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-ink-50">
        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${TAG_COLORS[post.tag] ?? 'bg-ink-100 text-ink-600 border-ink-200'}`}>
          {post.tag}
        </span>
        <div className="flex-1" />
        <button onClick={handleLike}
          className={`flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border transition-colors ${liked ? 'bg-red-50 text-red-600 border-red-200' : 'text-ink-400 border-ink-100 hover:bg-ink-50'}`}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2">
            <path d="M6.5 11S1 7.5 1 4a2.5 2.5 0 015 0 2.5 2.5 0 015 0c0 3.5-5.5 7-5.5 7z"/>
          </svg>
          {(post.vote_count ?? 0) + (liked ? 1 : 0)}
        </button>
        <button onClick={(e) => { e.stopPropagation(); window.location.href = `/post/${post.id}` }}
          className="flex items-center gap-1 text-[12px] text-ink-400 px-2.5 py-1 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M11.5 1h-10a1 1 0 00-1 1v6a1 1 0 001 1h3l2 2 2-2h3a1 1 0 001-1V2a1 1 0 00-1-1z"/>
          </svg>
          {post.comment_count ?? 0}
        </button>
        <button onClick={handleShare}
          className="flex items-center text-[12px] text-ink-400 px-2.5 py-1 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
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
  const [activeTab, setActiveTab] = useState('kesffet')
  const [kategoriler, setKategoriler] = useState<string[]>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('kategoriler') || '[]') : [])
  const [activeSector, setActiveSector] = useState<string | null>(null)
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null)
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

  const handleHashtagClick = (tag: string) => {
    setActiveHashtag(activeHashtag === tag ? null : tag)
    setActiveFilter('Tümü')
    setActiveSector(null)
  }

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'kategorilerim' && kategoriler.length > 0) {
      return kategoriler.some(k => {
        if (k === 'Maaş') return post.tag === 'Maaş'
        if (k === 'Burnout') return post.tag === 'Çalışma kültürü' || post.tag === 'Burnout'
        if (k === 'Kariyer') return post.tag === 'Kariyer değişikliği' || post.tag === 'Kariyer sorunu'
        if (k === 'Gündem') return post.vote_count > 50
        if (k === 'Anket') return post.type === 'poll'
        return false
      })
    }
    if (activeHashtag) return post.hashtags?.includes(activeHashtag)
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
      <Navbar onFilterChange={(f) => { setActiveFilter(f); setActiveSector(null); setActiveHashtag(null) }} />
      <section style={{background: "#1a1a1a"}} className="text-center py-16 px-8 w-full">
        <span style={{border: "0.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", padding: "4px 14px", borderRadius: "20px", display: "inline-block", marginBottom: "1.5rem"}}>BETA</span>
        <h1 style={{fontSize: "2.4rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.25, margin: "0 0 1rem"}}>
          Türkiye'nin <span style={{fontStyle: "italic"}}>anonim</span> <span style={{fontSize: "1rem", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.35)"}}>(opsiyonel)</span><br/>beyaz yaka deneyim platformu
        </h1>
        <p style={{fontSize: "1rem", color: "rgba(255,255,255,0.55)", margin: "0 auto 2rem", maxWidth: "440px", lineHeight: 1.6}}>Özgeçmişte yazmadığın her şey için. Maaş, kültür, gerçek deneyim — anonim, kimse görmez.</p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap"}}>
          <button style={{background: "#ffffff", color: "#1a1a1a", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer"}}>Üye ol — ücretsiz</button>
          <button style={{background: "transparent", color: "#ffffff", border: "0.5px solid rgba(255,255,255,0.3)", padding: "10px 22px", borderRadius: "8px", fontSize: "14px", cursor: "pointer"}}>Nasıl çalışır?</button>
        </div>
        <div style={{display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "2rem", flexWrap: "wrap"}}>
          <div style={{textAlign: "center"}}><div style={{fontSize: "1.4rem", fontWeight: 700, color: "#ffffff"}}>4.2K+</div><div style={{fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px"}}>paylaşım</div></div>
          <div style={{textAlign: "center"}}><div style={{fontSize: "1.4rem", fontWeight: 700, color: "#ffffff"}}>1.8K+</div><div style={{fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px"}}>çalışanların paylaştığı maaş verisi</div></div>
          <div style={{textAlign: "center"}}><div style={{fontSize: "1.4rem", fontWeight: 700, color: "#ffffff"}}>200+</div><div style={{fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px"}}>şirket</div></div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", maxWidth: "700px", margin: "0 auto"}}>
          <div style={{background: "#2a2a2a", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", textAlign: "left"}}><div style={{fontSize: "20px", marginBottom: "0.6rem"}}>🔒</div><p style={{fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px"}}>%100 Anonim</p><p style={{fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5}}>Kimliğini gizleyerek paylaş, gerçek deneyimleri oku.</p></div>
          <div style={{background: "#2a2a2a", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", textAlign: "left"}}><div style={{fontSize: "20px", marginBottom: "0.6rem"}}>💰</div><p style={{fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px"}}>Maaş Şeffaflığı</p><p style={{fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5}}>Çalışanların paylaştığı gerçek maaş aralıklarını gör.</p></div>
          <div style={{background: "#2a2a2a", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", textAlign: "left"}}><div style={{fontSize: "20px", marginBottom: "0.6rem"}}>🏢</div><p style={{fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px"}}>Şirket Kültürü</p><p style={{fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5}}>200+ şirkette çalışan deneyimleri ve yorumları.</p></div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-6">

          <aside className="hidden md:block">
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <button key={item.label}
                  onClick={() => { setActiveFilter(item.filter); setActiveSector(null); setActiveHashtag(null) }}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${activeFilter === item.filter && !activeSector && !activeHashtag ? 'bg-ink-900 text-white font-medium' : 'text-ink-600 hover:bg-ink-100'}`}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-5 pt-4 border-t border-ink-100">
              <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider px-3 mb-2">Sektörler</p>
              <nav className="space-y-0.5">
                {['Teknoloji', 'Finans', 'Pazarlama', 'Danışmanlık', 'İnsan kaynakları'].map(s => (
                  <button key={s}
                    onClick={() => { setActiveSector(activeSector === s ? null : s); setActiveFilter('Tümü'); setActiveHashtag(null) }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-colors ${activeSector === s ? 'bg-ink-900 text-white font-medium' : 'text-ink-500 hover:bg-ink-100'}`}>
                    {s}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="flex border-b border-ink-100 mb-4">
              <button
                onClick={() => setActiveTab('kesffet')}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${activeTab === 'kesffet' ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-600'}`}>
                Keşfet
              </button>
              <button
                onClick={() => setActiveTab('kategorilerim')}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${activeTab === 'kategorilerim' ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-600'}`}>
                Kategorilerim
              </button>
            </div>
            {activeTab === 'kategorilerim' && (
              <div className="bg-white rounded-xl border border-ink-100 p-4 mb-4">
                <p className="text-[13px] font-medium text-ink-700 mb-3">Hangi konuları görmek istiyorsun?</p>
                <div className="flex flex-wrap gap-2">
                  {['Maaş', 'Burnout', 'Kariyer', 'Gündem', 'Anket'].map(k => (
                    <button key={k}
                      onClick={() => {
                        const prev = JSON.parse(localStorage.getItem('kategoriler') || '[]')
                        const next = prev.includes(k) ? prev.filter((x: string) => x !== k) : [...prev, k]
                        localStorage.setItem('kategoriler', JSON.stringify(next))
                        setKategoriler(next)
                      }}
                      className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${kategoriler.includes(k) ? 'bg-ink-900 text-white border-ink-900' : 'border-ink-200 text-ink-500 bg-white hover:border-ink-400'}`}>
                      {k}
                    </button>
                  ))}
                </div>
                {kategoriler.length === 0 && <p className="text-[11px] text-ink-400 mt-3">En az bir kategori seç, o konulardaki paylaşımlar burada görünür.</p>}
              </div>
            )}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button key={f}
                  onClick={() => { setActiveFilter(f); setActiveSector(null); setActiveHashtag(null) }}
                  className={`shrink-0 text-[12px] px-3 py-1.5 rounded-full border transition-colors ${activeFilter === f && !activeSector && !activeHashtag ? 'bg-ink-900 text-white border-ink-900' : 'border-ink-200 text-ink-500 bg-white hover:border-ink-400'}`}>
                  {f}
                </button>
              ))}
            </div>

            {activeHashtag && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[13px] text-blue-700 font-medium">{activeHashtag}</span>
                <button onClick={() => setActiveHashtag(null)} className="text-[11px] text-ink-400 hover:text-ink-700">✕ temizle</button>
              </div>
            )}

            <WriteBox onPost={fetchPosts} />

            {loading ? (
              <div className="text-center py-12 text-ink-400 text-[13px]">Yükleniyor...</div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-3">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onLike={handleLike} onHashtagClick={handleHashtagClick} />
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
                  <button onClick={() => handleHashtagClick(item.tag)} className="text-[12px] text-blue-600 hover:text-blue-800">{item.tag}</button>
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