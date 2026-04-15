'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PostPage() {
  const { id } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [isAnon, setIsAnon] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single()
      setPost(data)
      const { data: c } = await supabase
        .from('comments')
        .select('*, profiles(username, sector, level)')
        .eq('post_id', id)
        .order('created_at', { ascending: true })
      setComments(c ?? [])
      setLoading(false)
    }
    fetchPost()
  }, [id])

  const handleComment = async () => {
    if (!comment.trim()) return
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('comments').insert({
      post_id: id,
      content: comment.trim(),
      is_anon: isAnon,
      user_id: user?.id ?? null,
    })
    if (!error) {
      setComment('')
      const { data: c } = await supabase
        .from('comments')
        .select('*, profiles(username, sector, level)')
        .eq('post_id', id)
        .order('created_at', { ascending: true })
      setComments(c ?? [])
    }
    setSubmitting(false)
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const text = post?.title ?? ''
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`)
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-ink-400 text-[13px]">Yükleniyor...</div>
    </>
  )

  if (!post) return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-ink-400 text-[13px]">Gönderi bulunamadı.</div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-ink-400 hover:text-ink-700 mb-6 transition-colors">
          ← Geri dön
        </button>

        <div className="bg-white rounded-xl border border-ink-100 p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="6" r="3" stroke="#888" strokeWidth="1.2"/>
                <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="text-[13px] font-medium text-ink-800">{post.is_anon ? 'Anonim' : 'Üye'}</span>
              {post.is_anon && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">gizli</span>}
              {post.sector && post.sector !== 'Genel' && (
                <span className="ml-1.5 text-[10px] px-2 py-0.5 rounded-full bg-ink-900 text-white font-medium">{post.sector}</span>
              )}
              <p className="text-[11px] text-ink-400">{new Date(post.created_at).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          <h1 className="text-[20px] font-semibold text-ink-900 leading-snug mb-3">{post.title}</h1>
          {post.content && <p className="text-[14px] text-ink-600 leading-relaxed mb-4">{post.content}</p>}

          <div className="flex items-center gap-2 pt-4 border-t border-ink-50 flex-wrap">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-ink-100 text-ink-600 border border-ink-200">{post.tag}</span>
            <div className="flex-1" />
            <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </button>
            <button onClick={() => handleShare('twitter')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </button>
            <button onClick={() => handleShare('copy')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
              {copied ? '✓ Kopyalandı' : 'Linki kopyala'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-[13px] font-medium text-ink-700 mb-3">{comments.length} yorum</h2>
          <div className="space-y-3">
            {comments.map(c => {
              const profile = c.profiles
              const displayName = c.is_anon ? 'Anonim' : (profile?.username ?? 'Üye')
              const sector = profile?.sector
              const level = profile?.level
              const canLink = !c.is_anon && profile?.username

              return (
                <div key={c.id} className="bg-white rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-ink-100 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="4.5" r="2.2" stroke="#888" strokeWidth="1.1"/>
                        <path d="M1.5 11c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="#888" strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {canLink ? (
                        <Link href={`/profil/${profile.username}`} className="text-[12px] font-medium text-brand-600 hover:underline">
                          {displayName}
                        </Link>
                      ) : (
                        <span className="text-[12px] font-medium text-ink-700">{displayName}</span>
                      )}
                      {c.is_anon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">gizli</span>
                      )}
                      {sector && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-900 text-white font-medium">{sector}</span>
                      )}
                      {level && (
                        <span className="text-[11px] text-ink-400">{level}</span>
                      )}
                      <span className="text-[11px] text-ink-400">{new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink-700 leading-relaxed">{c.content}</p>
                </div>
              )
            })}
            {comments.length === 0 && (
              <p className="text-[13px] text-ink-400 text-center py-6">Henüz yorum yok. İlk yorumu sen yaz!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-100 p-4">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Yorumunu yaz..."
            rows={3}
            className="w-full text-[13px] text-ink-700 placeholder-ink-300 outline-none resize-none mb-3"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAnon(v => !v)}
              className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${isAnon ? 'bg-ink-100 text-ink-600 border-ink-200' : 'bg-ink-800 text-white border-ink-800'}`}
            >
              {isAnon ? 'Anonim' : 'Adımla'}
            </button>
            <button
              onClick={handleComment}
              disabled={submitting || !comment.trim()}
              className="text-[12px] font-medium text-white px-4 py-1.5 rounded-md bg-ink-900 hover:bg-ink-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Gönderiliyor...' : 'Yorum yap'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
