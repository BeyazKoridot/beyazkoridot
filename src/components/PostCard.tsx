'use client'
import { useState } from 'react'
import { Post, TAG_COLORS } from '@/lib/data'

export default function PostCard({ post }: { post: Post }) {
  const [votes, setVotes] = useState(post.votes)
  const [voted, setVoted] = useState(false)

  const colors = TAG_COLORS[post.tagColor] ?? TAG_COLORS['brand']

  const handleVote = () => {
    setVotes(v => voted ? v - 1 : v + 1)
    setVoted(v => !v)
  }

  return (
    <article className="post-card bg-white rounded-xl border border-ink-100 p-4">
      {/* Poll accent */}
      {post.type === 'poll' && (
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          <span className="text-[11px] font-medium text-brand-600 uppercase tracking-wider">Anket</span>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        {post.isAnon ? (
          <div className="w-7 h-7 rounded-full bg-ink-100 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke="#888780" strokeWidth="1.2"/>
              <path d="M2 12c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke="#888780" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-[11px] font-medium text-brand-800">
            {post.author?.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-ink-800">
              {post.isAnon ? 'Anonim' : post.author}
            </span>
            {post.isAnon && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-500">gizli</span>
            )}
          </div>
          <p className="text-[11px] text-ink-400">
            {[post.sector, post.level, post.timeAgo].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-[14px] font-medium text-ink-900 leading-snug mb-2 cursor-pointer hover:text-brand-600 transition-colors">
        {post.title}
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-[12px] text-ink-500 leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>
      )}

      {/* Poll options */}
      {post.type === 'poll' && post.pollOptions && (
        <div className="flex flex-col gap-1.5 mb-3">
          {post.pollOptions.map(opt => (
            <div key={opt.label} className="relative">
              <div
                className="absolute inset-0 rounded-md bg-brand-50"
                style={{ width: `${opt.pct}%` }}
              />
              <div className="relative flex items-center justify-between px-3 py-1.5">
                <span className="text-[12px] text-ink-700">{opt.label}</span>
                <span className="text-[12px] font-medium text-brand-600">{opt.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink-50">
        {/* Tag */}
        <span
          className="tag-chip text-[11px] px-2 py-0.5 rounded-full border"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {post.tag}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Vote */}
        {post.type !== 'poll' && (
          <button
            onClick={handleVote}
            className={`vote-btn flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-md border ${
              voted ? 'border-brand-200 bg-brand-50 text-brand-600' : 'border-ink-100 text-ink-500'
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L9 5H6.5v4h-3V5H1L5 1z" fill="currentColor"/>
            </svg>
            {votes}
          </button>
        )}

        {/* Comments */}
        <button className="flex items-center gap-1 text-[12px] text-ink-400 hover:text-ink-700 px-2 py-1 rounded-md hover:bg-ink-50 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 1H2a1 1 0 00-1 1v6a1 1 0 001 1h3l2 2 2-2h1a1 1 0 001-1V2a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.1"/>
          </svg>
          {post.comments}
        </button>

        {/* Share */}
        <button className="text-[12px] text-ink-400 hover:text-ink-700 px-2 py-1 rounded-md hover:bg-ink-50 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="9.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
            <circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
            <circle cx="2.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
            <path d="M4 6l4-3.5M4 6l4 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </article>
  )
}
