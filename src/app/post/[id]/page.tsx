'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
              WhatsApp
            </button>
            <button onClick={() => handleShare('twitter')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
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
              const displayName = c.display_name ?? (c.is_anon ? 'Anonim' : 'Üye')
              const sector = c.display_sector ?? c.profiles?.sector
              const level = c.display_level ?? c.profiles?.level

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
                      <span className="text-[12px] font-medium text-ink-700">{displayName}</span>
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
