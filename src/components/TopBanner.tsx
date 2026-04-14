'use client'
import { useState } from 'react'

type BannerProps = {
  label?: string
  headline: string
  sub: string
  cta: string
  ctaHref?: string
  variant?: 'brand' | 'neutral'
}

export default function TopBanner({
  label = 'Sponsorlu',
  headline,
  sub,
  cta,
  ctaHref = '#',
  variant = 'brand',
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const isBrand = variant === 'brand'

  return (
    <div
      className={`w-full border-b ${
        isBrand
          ? 'bg-brand-600 border-brand-800 text-white'
          : 'bg-white border-ink-100 text-ink-900'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-4">
        {/* Sponsor label */}
        <span
          className={`hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
            isBrand ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-600'
          }`}
        >
          {label}
        </span>

        {/* Content */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
          <p className={`text-[13px] font-medium truncate ${isBrand ? 'text-white' : 'text-ink-900'}`}>
            {headline}
          </p>
          <p className={`text-[12px] truncate hidden sm:block ${isBrand ? 'text-brand-100' : 'text-ink-400'}`}>
            {sub}
          </p>
        </div>

        {/* CTA */}
        <a
          href={ctaHref}
          className={`shrink-0 text-[12px] font-medium px-4 py-1.5 rounded-md transition-colors ${
            isBrand
              ? 'bg-white text-brand-800 hover:bg-brand-50'
              : 'bg-brand-600 text-white hover:bg-brand-800'
          }`}
        >
          {cta}
        </a>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className={`shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors ${
            isBrand ? 'hover:bg-white/20 text-white/70 hover:text-white' : 'hover:bg-ink-100 text-ink-400'
          }`}
          aria-label="Kapat"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
