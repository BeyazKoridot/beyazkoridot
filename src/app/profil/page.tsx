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

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUser(user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)
      const { data: myPosts } = await supabase.from('posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setPosts(myPosts ?? [])
      setLoading(false)
    }
    fetchProfile()
  }, [])

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
        <h1 className="text-[20px] font-bold text-ink-900 mb-2">Profilini görmek için giriş yap</h1>
        <p className="text-[13px] text-ink-500 mb-6">Gönderilerini takip et, profilini yönet.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => setShowAuth(true)} className="w-full px-6 py-3 bg-ink-900 text-white rounded-xl text-[14px] font-semibold hover:bg-ink-700 transition-colors">
            Giriş yap
          </button>
          <a href="/" className="w-full px-6 py-3 border border-ink-200 text-ink-600 rounded-xl text-[14px] font-medium hover:bg-ink-50 transition-colors text-center">
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
        <div className="bg-white rounded-xl border border-ink-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-ink-900 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[18px] font-bold">{user.email?.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-ink-900">{profile?.username ?? 'Kullanıcı'}</h1>
              <p className="text-[13px] text-ink-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {profile?.sector && (
              <span className="text-[12px] px-3 py-1 rounded-full bg-ink-900 text-white font-medium">{profile.sector}</span>
            )}
            {profile?.level && (
              <span className="text-[12px] px-3 py-1 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{profile.level}</span>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-50 flex items-center justify-between">
            <span className="text-[13px] text-ink-500">{posts.length} gönderi</span>
            <div className="flex items-center gap-2">
              <a href="/profil/duzenle" className="text-[12px] text-ink-600 hover:text-ink-900 px-3 py-1.5 rounded-lg border border-ink-200 hover:bg-ink-50 transition-colors">
                Düzenle
              </a>
              <button onClick={handleSignOut} className="text-[12px] text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-colors">
                Çıkış yap
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-[15px] font-semibold text-ink-900 mb-3">Gönderilerin</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-ink-400 text-[13px]">Henüz gönderin yok. İlk gönderini yaz!</div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl border border-ink-100 p-4 hover:border-ink-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{post.tag}</span>
                  {post.is_anon && <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">anonim</span>}
                  <span className="text-[11px] text-ink-400 ml-auto">{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h3
                  onClick={() => window.location.href = `/post/${post.id}`}
                  className="text-[14px] font-medium text-ink-900 leading-snug cursor-pointer hover:text-ink-600"
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
        )}
      </div>
      <Footer />
    </>
  )
}