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
import AuthModal from '@/components/AuthModal'
import ProductTour from '@/components/ProductTour'

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

function PostCard({ post, onLike, onHashtagClick, currentUserId, likedPostIds, onQuote }: { post: any; onLike: (id: string) => void; onHashtagClick: (tag: string) => void; currentUserId?: string; likedPostIds?: Set<string>; onQuote?: (post: any) => void }) {
  if (post.is_sponsored) return (
    <div className="bg-white rounded-xl p-4 mb-3 relative" style={{border: '1.5px solid #BA7517'}}>
      <div className="absolute -top-px right-3 text-white text-[10px] font-medium px-2 py-0.5 rounded-b-md" style={{background: '#BA7517'}}>SPONSORLU</div>
      <div className="flex items-center gap-2.5 mt-1.5 mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-ink-100 flex items-center justify-center shrink-0">
          <span className="text-[15px] font-medium text-blue-700">{post.sponsor_name?.[0] ?? 'S'}</span>
        </div>
        <div>
          <p className="text-[13px] font-medium text-ink-900">{post.sponsor_name}</p>
          <p className="text-[11px] text-ink-400">Sponsorlu içerik</p>
        </div>
      </div>
      <h3 className="text-[14px] font-medium text-ink-900 mb-1.5 leading-snug">{post.title}</h3>
      {post.content && <p className="text-[12px] text-ink-500 mb-3 line-clamp-2">{post.content}</p>}
      <div className="flex items-center justify-between pt-2.5 border-t border-ink-50">
        <span className="text-[11px] text-ink-400">{post.sponsor_url}</span>
        {post.sponsor_url && <a href={post.sponsor_url} target="_blank" className="text-[12px] font-medium text-white px-3 py-1.5 rounded-lg" style={{background: '#185FA5'}}>Devamını gör</a>}
      </div>
    </div>
  )
  const liked = likedPostIds?.has(post.id) ?? false
  const [imgError, setImgError] = useState(false)
  const [quotedPost, setQuotedPost] = useState<any>(null)
  useEffect(() => {
    if (post.quote_post_id) {
      supabase.from('posts').select('*').eq('id', post.quote_post_id).single().then(({ data }) => setQuotedPost(data))
    }
  }, [post.quote_post_id])

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
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
          {post.vote_count ?? 0}
        </button>
        <button onClick={(e) => { e.stopPropagation(); window.location.href = `/post/${post.id}` }}
          className="flex items-center gap-1 text-[12px] text-ink-400 px-2.5 py-1 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M11.5 1h-10a1 1 0 00-1 1v6a1 1 0 001 1h3l2 2 2-2h3a1 1 0 001-1V2a1 1 0 00-1-1z"/>
          </svg>
          {post.comment_count ?? 0}
        </button>
        <span className="flex items-center gap-1 text-[12px] text-ink-400 px-2.5 py-1">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <ellipse cx="6.5" cy="6.5" rx="5.5" ry="3.5"/>
            <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
          </svg>
          {post.view_count ?? 0}
        </span>
        <button onClick={(e) => { e.stopPropagation(); onQuote?.(post) }}
          className="flex items-center gap-1 text-[12px] text-ink-400 px-2.5 py-1 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 4h7a3 3 0 010 6H5"/><path d="M3 2L1 4l2 2"/></svg>
          {post.quote_count > 0 ? post.quote_count : ''}
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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [isForced, setIsForced] = useState(false)

  useEffect(() => {
    let timerRef: ReturnType<typeof setTimeout> | null = null

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        if (timerRef) {
          clearTimeout(timerRef)
          timerRef = null
        }
        setShowAuthModal(false)
        setIsForced(false)
      }
    })

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        timerRef = setTimeout(() => {
          setShowAuthModal(true)
          setIsForced(true)
        }, 8000)
      } else {
        const tourDone = localStorage.getItem('otr_tour_done')
        if (!tourDone) setShowTour(true)
      }
    }
    checkAuth()

    return () => {
      subscription.unsubscribe()
      if (timerRef) clearTimeout(timerRef)
    }
  }, [])
  const [quotePost, setQuotePost] = useState<any>(null)
  const [quoteText, setQuoteText] = useState('')
  const [quoteAnon, setQuoteAnon] = useState(true)
  const [quoteLoading, setQuoteLoading] = useState(false)
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

  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('post_likes').select('post_id').eq('user_id', data.user.id).then(({ data: likes }) => {
          if (likes) setLikedPostIds(new Set(likes.map((l: any) => l.post_id)))
        })
      }
    })
  }, [])

  const handleQuoteSubmit = async () => {
    if (!quotePost || !quoteText.trim()) return
    setQuoteLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setShowAuthModal(true); setQuoteLoading(false); return }
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
    await supabase.from('posts').insert({
      title: quoteText.trim(),
      is_anon: quoteAnon,
      author_name: quoteAnon ? null : profile?.username,
      user_id: user.id,
      quote_post_id: quotePost.id,
      vote_count: 0, comment_count: 0, view_count: 0, quote_count: 0,
      tag: quotePost.tag,
      sector: quotePost.sector,
    })
    await supabase.from('posts').update({ quote_count: (quotePost.quote_count ?? 0) + 1 }).eq('id', quotePost.id)
    setQuotePost(null)
    setQuoteText('')
    fetchPosts()
    setQuoteLoading(false)
  }

  const handleLike = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const isLiked = likedPostIds.has(id)
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLikedPostIds(prev => { const next = new Set(prev); next.delete(id); return next })
      setPosts(prev => prev.map(p => p.id === id ? { ...p, vote_count: Math.max(0, p.vote_count - 1) } : p))
    } else {
      await supabase.from('post_likes').insert({ post_id: id, user_id: user.id })
      setLikedPostIds(prev => new Set([...prev, id]))
      setPosts(prev => prev.map(p => p.id === id ? { ...p, vote_count: p.vote_count + 1 } : p))
    }
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
      {showAuthModal && <AuthModal onClose={() => { if (!isForced) setShowAuthModal(false) }} defaultMode="register" isForced={isForced} />}
      {showTour && <ProductTour onDone={() => setShowTour(false)} />}
      {quotePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setQuotePost(null)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-medium text-ink-900">Alıntıla</p>
              <button onClick={() => setQuotePost(null)} className="text-ink-400 hover:text-ink-700">✕</button>
            </div>
            <textarea
              value={quoteText}
              onChange={e => setQuoteText(e.target.value)}
              placeholder="Yorumunu ekle..."
              rows={3}
              autoFocus
              className="w-full text-[13px] text-ink-800 placeholder-ink-300 outline-none resize-none mb-3"
            />
            <div className="border border-ink-100 rounded-xl p-3 mb-4 bg-ink-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-ink-900 flex items-center justify-center shrink-0">
                  <span className="text-white text-[8px] font-bold">OTR</span>
                </div>
                <span className="text-[12px] font-medium text-ink-700">{quotePost.author_name ?? 'Anonim'}</span>
                <span className="text-[11px] text-ink-400">· {quotePost.sector}</span>
              </div>
              <p className="text-[12px] text-ink-600 line-clamp-2">{quotePost.title}</p>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setQuoteAnon(v => !v)} className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${quoteAnon ? 'bg-ink-100 text-ink-600 border-ink-200' : 'bg-ink-900 text-white border-ink-900'}`}>
                {quoteAnon ? 'Anonim' : 'Adımla'}
              </button>
              <button onClick={handleQuoteSubmit} disabled={quoteLoading || !quoteText.trim()} className="text-[12px] font-medium text-white px-4 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-700 disabled:opacity-50 transition-colors">
                {quoteLoading ? 'Paylaşılıyor...' : 'Paylaş'}
              </button>
            </div>
          </div>
        </div>
      )}
      <TopBanner label="Sponsorlu" headline="Kariyer koçluğu — ücretsiz ilk seans" sub="Beyaz yaka profesyonelleri için 1:1 mentorluk" cta="Başvur" variant="brand" />
      <Navbar onFilterChange={(f) => { setActiveFilter(f); setActiveSector(null); setActiveHashtag(null) }} />
      <section style={{background: "#1a1a1a"}} className="text-center py-16 px-8 w-full">
        <span style={{border: "0.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", padding: "4px 14px", borderRadius: "20px", display: "inline-block", marginBottom: "1.5rem"}}>BETA</span>
        <h1 style={{fontSize: "2.4rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.25, margin: "0 0 1rem"}}>
          Türkiye'nin <span style={{fontStyle: "italic"}}>anonim</span> <span style={{fontSize: "1rem", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.35)"}}>"(opsiyonel)"</span><br/>beyaz yaka deneyim platformu
        </h1>
        <p style={{fontSize: "1rem", color: "rgba(255,255,255,0.55)", margin: "0 auto 2rem", maxWidth: "440px", lineHeight: 1.6}}>Özgeçmişte yazmadığın her şey için. Maaş, kültür, gerçek deneyim — anonim, kimse görmez.</p>
        <div style={{display: "flex", gap: "12px", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap"}}>
          <button onClick={() => setShowAuthModal(true)} style={{background: "#ffffff", color: "#1a1a1a", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer"}}>Üye ol — ücretsiz</button>
          <a href="/hakkinda" style={{background: "transparent", color: "#ffffff", border: "0.5px solid rgba(255,255,255,0.3)", padding: "10px 22px", borderRadius: "8px", fontSize: "14px", cursor: "pointer", textDecoration: "none", display: "inline-block"}}>Nasıl çalışır?</a>
        </div>
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <div style={{fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginBottom: "6px"}}>Yeni başladık.</div>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto"}}>İlk 1000 üye arasına katıl. Beta dönemindeki üyelere özel rozet ve erken erişim ayrıcalıkları.</div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", maxWidth: "700px", margin: "0 auto"}}>
          <div style={{background: "#2a2a2a", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", textAlign: "left"}}><div style={{fontSize: "20px", marginBottom: "0.6rem"}}>🔒</div><p style={{fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px"}}>%100 Anonim</p><p style={{fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5}}>Kimliğini gizleyerek paylaş, gerçek deneyimleri oku.</p></div>
          <div style={{background: "#2a2a2a", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", textAlign: "left"}}><div style={{fontSize: "20px", marginBottom: "0.6rem"}}>💰</div><p style={{fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px"}}>Maaş Şeffaflığı</p><p style={{fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5}}>Çalışanların paylaştığı gerçek maaş aralıklarını gör.</p></div>
          <div style={{background: "#2a2a2a", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", textAlign: "left"}}><div style={{fontSize: "20px", marginBottom: "0.6rem"}}>🏢</div><p style={{fontSize: "13px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px"}}>Şirket Kültürü</p><p style={{fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5}}>Çalışanların paylaştığı şirket içi gerçek deneyimler.</p></div>
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
            <div className="flex gap-1.5 p-1 bg-ink-100 rounded-xl mb-4">
              <button
                onClick={() => setActiveTab('kesffet')}
                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors ${activeTab === 'kesffet' ? 'bg-white text-ink-900 border border-ink-200' : 'text-ink-400 hover:text-ink-600'}`}>
                Keşfet
              </button>
              <button
                onClick={() => setActiveTab('kategorilerim')}
                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors ${activeTab === 'kategorilerim' ? 'bg-white text-ink-900 border border-ink-200' : 'text-ink-400 hover:text-ink-600'}`}>
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

            <div id="writebox"><WriteBox onPost={fetchPosts} /></div>

            {loading ? (
              <div className="text-center py-12 text-ink-400 text-[13px]">Yükleniyor...</div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-3">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onLike={handleLike} onHashtagClick={handleHashtagClick} likedPostIds={likedPostIds} onQuote={setQuotePost} />
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