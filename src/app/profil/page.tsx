'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts')
  const [workEmail, setWorkEmail] = useState('')
  const [workEmailStep, setWorkEmailStep] = useState<'idle' | 'input' | 'code'>('idle')
  const [verifyCode, setVerifyCode] = useState('')
  const [workEmailLoading, setWorkEmailLoading] = useState(false)
  const [workEmailError, setWorkEmailError] = useState('')
  const [workEmailSuccess, setWorkEmailSuccess] = useState(false)

  useEffect(() => {
    const fetchProfileData = async (userId: string) => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', userId).single()
      setProfile(p)
      const { data: myPosts } = await supabase.from('posts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      setPosts(myPosts ?? [])
      const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', userId)
      if (likes && likes.length > 0) {
        const likedIds = likes.map((l: any) => l.post_id)
        const { data: likedPostsData } = await supabase.from('posts').select('*').in('id', likedIds).order('created_at', { ascending: false })
        setLikedPosts(likedPostsData ?? [])
      }
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          setUser(session.user)
          fetchProfileData(session.user.id)
        } else {
          setLoading(false)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSendVerification = async () => {
    setWorkEmailLoading(true)
    setWorkEmailError('')
    const res = await fetch('/api/verify-work-email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, workEmail }),
    })
    const data = await res.json()
    setWorkEmailLoading(false)
    if (!res.ok) { setWorkEmailError(data.error); return }
    setWorkEmailStep('code')
  }

  const handleConfirmVerification = async () => {
    setWorkEmailLoading(true)
    setWorkEmailError('')
    const res = await fetch('/api/verify-work-email/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, token: verifyCode }),
    })
    const data = await res.json()
    setWorkEmailLoading(false)
    if (!res.ok) { setWorkEmailError(data.error); return }
    setWorkEmailSuccess(true)
    setWorkEmailStep('idle')
    setProfile((p: any) => ({ ...p, work_email: data.workEmail, work_email_verified: true }))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğine emin misin?')) return
    setDeleting(postId)
    await supabase.from('posts').delete().eq('id', postId)
    setPosts(posts.filter(p => p.id !== postId))
    setDeleting(null)
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center py-12 text-ink-400 text-[13px]">Yükleniyor...</div>
    </>
  )

  if (!user) return (
    <>
      <Navbar onFilterChange={() => {}} />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#888" strokeWidth="1.5">
            <circle cx="14" cy="10" r="5"/><path d="M5 24c0-5 4-9 9-9s9 4 9 9" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-[20px] font-bold text-[#0a0a0a] mb-2">Profilini görmek için giriş yap</h1>
        <p className="text-[13px] text-ink-500 mb-6">Gönderilerini takip et, profilini yönet.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => setShowAuth(true)} className="w-full px-6 py-3 bg-[#0000FF] text-white rounded-xl text-[14px] font-semibold hover:bg-[#0000cc] transition-colors">
            Giriş yap
          </button>
          <a href="/" className="w-full px-6 py-3 border border-ink-200 text-ink-600 rounded-xl text-[14px] font-medium hover:bg-[#f0f6ff] transition-colors text-center">
            Ana sayfaya dön
          </a>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-[#e0e8f5] p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0000FF] flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[18px] font-bold">{user.email?.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#0a0a0a]">{profile?.username ?? 'Kullanıcı'}</h1>
              <p className="text-[13px] text-ink-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {profile?.sector && (
              <span className="text-[12px] px-3 py-1 rounded-full bg-[#0000FF] text-white font-medium">{profile.sector}</span>
            )}
            {profile?.level && (
              <span className="text-[12px] px-3 py-1 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{profile.level}</span>
            )}
            {profile?.work_email_verified && (
              <span className="text-[12px] px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                ✓ Doğrulanmış çalışan
              </span>
            )}
          </div>

          {/* İş e-postası doğrulama */}
          <div className="mt-4 pt-4 border-t border-[#f0f6ff]">
            {workEmailSuccess && (
              <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-[12px] rounded-lg">
                ✓ İş e-postanız doğrulandı! Rozet profilinize eklendi.
              </div>
            )}
            {profile?.work_email_verified ? (
              <div className="flex items-center gap-2 text-[12px] text-ink-500">
                <span>✓</span>
                <span className="text-ink-700 font-medium">{profile.work_email}</span>
                <span className="text-ink-400">doğrulanmış iş e-postası</span>
              </div>
            ) : workEmailStep === 'idle' ? (
              <button
                onClick={() => setWorkEmailStep('input')}
                className="text-[12px] text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
              >
                <span>+</span> İş e-postanı doğrula → Doğrulanmış rozeti kazan
              </button>
            ) : workEmailStep === 'input' ? (
              <div className="space-y-2">
                <p className="text-[12px] font-medium text-ink-700">Kurumsal iş e-postanı gir</p>
                <p className="text-[11px] text-ink-400">Gmail, Hotmail gibi kişisel adresler kabul edilmez.</p>
                <div className="flex gap-2">
                  <input
                    value={workEmail}
                    onChange={e => setWorkEmail(e.target.value)}
                    placeholder="adi@sirket.com"
                    type="email"
                    className="flex-1 text-[12px] border border-ink-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={handleSendVerification}
                    disabled={workEmailLoading || !workEmail}
                    className="text-[12px] font-medium text-white px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {workEmailLoading ? '...' : 'Gönder'}
                  </button>
                  <button onClick={() => { setWorkEmailStep('idle'); setWorkEmailError('') }} className="text-[12px] text-ink-400 px-2">İptal</button>
                </div>
                {workEmailError && <p className="text-[11px] text-red-500">{workEmailError}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[12px] font-medium text-ink-700">Doğrulama kodunu gir</p>
                <p className="text-[11px] text-ink-400">{workEmail} adresine 6 haneli kod gönderildi. 30 dakika geçerli.</p>
                <div className="flex gap-2">
                  <input
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value.toUpperCase())}
                    placeholder="XXXXXX"
                    maxLength={6}
                    className="flex-1 text-[14px] font-mono tracking-widest border border-ink-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 uppercase"
                  />
                  <button
                    onClick={handleConfirmVerification}
                    disabled={workEmailLoading || verifyCode.length < 6}
                    className="text-[12px] font-medium text-white px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {workEmailLoading ? '...' : 'Doğrula'}
                  </button>
                  <button onClick={() => { setWorkEmailStep('input'); setWorkEmailError(''); setVerifyCode('') }} className="text-[12px] text-ink-400 px-2">Geri</button>
                </div>
                {workEmailError && <p className="text-[11px] text-red-500">{workEmailError}</p>}
                <button onClick={handleSendVerification} disabled={workEmailLoading} className="text-[11px] text-ink-400 hover:text-ink-600">
                  Kodu tekrar gönder
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#f0f6ff] flex items-center justify-between">
            <span className="text-[13px] text-ink-500">{posts.length} gönderi</span>
            <div className="flex items-center gap-2">
              <a href="/profil/duzenle" className="text-[12px] text-ink-600 hover:text-[#0a0a0a] px-3 py-1.5 rounded-lg border border-ink-200 hover:bg-[#f0f6ff] transition-colors">
                Düzenle
              </a>
              <button onClick={handleSignOut} className="text-[12px] text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-colors">
                Çıkış yap
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 p-1 bg-ink-100 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors ${activeTab === 'posts' ? 'bg-white text-[#0a0a0a] border border-ink-200' : 'text-ink-400 hover:text-ink-600'}`}>
            Gönderilerim ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors ${activeTab === 'likes' ? 'bg-white text-[#0a0a0a] border border-ink-200' : 'text-ink-400 hover:text-ink-600'}`}>
            Beğendiklerim ({likedPosts.length})
          </button>
        </div>
        <div className="space-y-3">
            {activeTab === 'likes' ? (
              likedPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-[#e0e8f5]">
                  <p className="text-[13px] text-ink-400">Henüz beğendiğin bir gönderi yok.</p>
                </div>
              ) : likedPosts.map(post => (
                <a key={post.id} href={`/post/${post.id}`} className="block bg-white rounded-xl border border-[#e0e8f5] p-4 hover:border-ink-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{post.tag}</span>
                    {post.is_anon && <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">anonim</span>}
                    <span className="text-[11px] text-ink-400 ml-auto">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <h3 className="text-[14px] font-medium text-[#0a0a0a] leading-snug mb-2">{post.title}</h3>
                  {post.content && <p className="text-[12px] text-ink-500 line-clamp-2 mb-3">{post.content}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-ink-400 pt-2 border-t border-[#f0f6ff]">
                    <span>♥ {post.vote_count ?? 0}</span>
                    <span>💬 {post.comment_count ?? 0}</span>
                    {post.sector && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#0000FF] text-white">{post.sector}</span>}
                  </div>
                </a>
              ))
            ) : posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl border border-[#e0e8f5] p-4 hover:border-ink-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{post.tag}</span>
                  {post.is_anon && <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">anonim</span>}
                  <span className="text-[11px] text-ink-400 ml-auto">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h3
                  onClick={() => window.location.href = `/post/${post.id}`}
                  className="text-[14px] font-medium text-[#0a0a0a] leading-snug cursor-pointer hover:text-ink-600"
                >
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-400">
                  <span>♥ {post.vote_count ?? 0}</span>
                  <span>💬 {post.comment_count ?? 0}</span>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-[11px] text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === post.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </div>
              </div>
            ))}
          </div>
      </div>
      <Footer />
    </>
  )
}