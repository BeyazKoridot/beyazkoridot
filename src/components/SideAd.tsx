type SideAdProps = {
  label?: string
  headline: string
  sub: string
  cta: string
  ctaHref?: string
  accent?: string
}

export default function SideAd({
  label = 'Sponsorlu',
  headline,
  sub,
  cta,
  ctaHref = '#',
}: SideAdProps) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white overflow-hidden">
      {/* Colored top bar */}
      <div className="h-1 w-full bg-brand-400" />
      <div className="p-4">
        <span className="text-[10px] font-medium text-ink-400 uppercase tracking-wider">{label}</span>
        <p className="mt-1.5 text-[13px] font-medium text-ink-900 leading-snug">{headline}</p>
        <p className="mt-1 text-[12px] text-ink-500 leading-relaxed">{sub}</p>
        <a
          href={ctaHref}
          className="mt-3 block text-center text-[12px] font-medium py-2 rounded-md bg-brand-50 text-brand-800 hover:bg-brand-100 transition-colors border border-brand-200"
        >
          {cta} →
        </a>
      </div>
    </div>
  )
}
