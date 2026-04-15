'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const YASAKLI_KELIMELER = ['aptal', 'salak', 'pislik', 'gerizekalı', 'mal', 'göt', 'orospu', 'siktir', 'amk', 'bok', 'sürtük', 'kahpe', 'öldür', 'öldüreceğim', 'gebereceğim', 'keriz', 'dangalak']

function containsBannedWord(text: string) {
  const lower = text.toLowerCase()
  return YASAKLI_KELIMELER.some(k => lower.includes(k))
}

function CommentThread({ comment, allComments, depth, postId, userId, onReplyAdded }: {
  comment: any
  allComments: any[]
  depth: number
  postId: string
  userId: string
  onReplyAdded: () => void
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isAnon, setIsAnon] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [liking, setLiking] = useState(false)

  const replies = allComments.filter(c => c.parent_id === comment.id)

  useEffect(() => {
    const fetchLikes = async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', comment.id)
      setLikeCount(count ?? 0)

      if (userId) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('comment_id', comment.id)
          .eq('user_id', userId)
          .single()
        setLiked(!!data)
      }
    }
    fetchLikes()
  }, [comment.id, userId])

  const handleLike = async () => {
    if (!userId || liking) return
    setLiking(true)
    if (liked) {
      await supabase.from('likes').delete().eq('comment_id', comment.id).eq('user_id', userId)
      setLiked(false)
      setLikeCount(v => v - 1)
    } else {
      await supabase.from('likes').insert({ comment_id: comment.id, user_id: userId })
      setLiked(true)
      setLikeCount(v => v + 1)
    }
    setLiking(false)
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    if (containsBannedWord(replyText)) {
      setError('İçeriğiniz uygunsuz ifadeler içeriyor.')
      return
    }
    setSubmitting(true)
    setError('')
    const { error: err } = await supabase.from('comments').insert({
      post_id: postId,
      content: replyText.trim(),
      is_anon: isAnon,
      user_id: userId,
      parent_id: comment.id,
      display_name: 'Anonim',
      display_sector: null,
      display_level: null,
    })
    if (!err) {
      setReplyText('')
      setShowReply(false)
      onReplyAdded()
    }
    setSubmitting(false)
  }

  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-ink-100 pl-4' : ''}>
      <div className="bg-white rounded-xl border border-ink-100 p-4 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-ink-100 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="4.5" r="2.2" stroke="#888" strokeWidth="1.1"/>
              <path d="M1.5 11c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="#888" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[12px] font-medium text-ink-700">
              {comment.display_name ?? (comment.is_anon ? 'Anonim' : 'Üye')}
            </span>
            {comment.is_anon && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">gizli</span>
            )}
            {comment.display_sector && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-900 text-white font-medium">{comment.display_sector}</span>
            )}
            {comment.display_level && (
              <span className="text-[11px] text-ink-400">{comment.display_level}</span>
            )}
            <span className="text-[11px] text-ink-400">{new Date(comment.created_at).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        <p className="text-[13px] text-ink-700 leading-relaxed mb-3">{comment.content}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? 'text-red-500' : 'text-ink-400 hover:text-red-400'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <button
            onClick={() => setShowReply(v => !v)}
            className="text-[11px] text-ink-400 hover:text-brand-600 transition-colors"
          >
            ↩ Yanıtla
          </button>
        </div>

        {showReply && (
          <div className="mt-3 pt-3 border-t border-ink-50">
            {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Yanıtını yaz..."
              rows={2}
              className="w-full text-[12px] text-ink-700 placeholder-ink-300 outline-none resize-none mb-2 border border-ink-100 rounded-lg p-2"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsAnon(v => !v)}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${isAnon ? 'bg-ink-100 text-ink-600 border-ink-200' : 'bg-ink-800 text-white border-ink-800'}`}
              >
                {isAnon ? 'Anonim' : 'Adımla'}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReply(false)}
                  className="text-[11px] text-ink-400 px-3 py-1 rounded-md hover:bg-ink-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleReply}
                  disabled={submitting || !replyText.trim()}
                  className="text-[11px] font-medium text-white px-3 py-1 rounded-md bg-ink-900 hover:bg-ink-700 disabled:opacity-50"
                >
                  {submitting ? '...' : 'Gönder'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {replies.map(reply => (
        <CommentThread
          key={reply.id}
          comment={reply}
          allComments={allComments}
          depth={depth + 1}
          postId={postId}
          userId={userId}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  )
}

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
  const [userId, setUserId] = useState<string>('')
  const [commentError, setCommentError] = useState('')

  const fetchComments = async () => {
    const { data: c } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    setComments(c ?? [])
  }

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single()
      setPost(data)
      await fetchComments()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? '8ee532b6-42a3-426b-850a-278ad90a2490')
      setLoading(false)
    }
    fetchPost()
  }, [id])

  const handleComment = async () => {
    if (!comment.trim()) return
    if (containsBannedWord(comment)) {
      setCommentError('İçeriğiniz uygunsuz ifadeler içeriyor.')
      return
    }
    setSubmitting(true)
    setCommentError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('comments').insert({
      post_id: id,
      content: comment.trim(),
      is_anon: isAnon,
      user_id: user?.id ?? null,
      display_name: 'Anonim',
    })
    if (!error) {
      setComment('')
      await fetchComments()
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

  const topLevelComments = comments.filter(c => !c.parent_id)

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
            <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">WhatsApp</button>
            <button onClick={() => handleShare('twitter')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">X</button>
            <button onClick={() => handleShare('copy')} className="flex items-center gap-1.5 text-[12px] text-ink-500 px-3 py-1.5 rounded-full border border-ink-100 hover:bg-ink-50 transition-colors">
              {copied ? '✓ Kopyalandı' : 'Linki kopyala'}
            </button>
            <button onClick={() => window.location.href='mailto:iletisim@beyazkoridot.com?subject=İçerik Şikayeti&body=Post ID: '+post.id} className='flex items-center gap-1.5 text-[12px] text-red-400 px-3 py-1.5 rounded-full border border-red-100 hover:bg-red-50 transition-colors'>Şikayet et</button>
          </div>
          <p className='text-[10px] text-ink-300 mt-2'>Bu içerik kullanıcı tarafından paylaşılmıştır. Platform doğruluğunu taahhüt etmez.</p>
        </div>

        <div className="mb-4">
          <h2 className="text-[13px] font-medium text-ink-700 mb-3">{comments.length} yorum</h2>
          <div className="space-y-3">
            {topLevelComments.map(c => (
              <CommentThread
                key={c.id}
                comment={c}
                allComments={comments}
                depth={0}
                postId={id as string}
                userId={userId}
                onReplyAdded={fetchComments}
              />
            ))}
            {topLevelComments.length === 0 && (
              <p className="text-[13px] text-ink-400 text-center py-6">Henüz yorum yok. İlk yorumu sen yaz!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-ink-100 p-4">
          {commentError && <p className="text-[11px] text-red-500 mb-2">{commentError}</p>}
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
