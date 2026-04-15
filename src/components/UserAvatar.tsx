export default function UserAvatar({ size = 40 }: { size?: number }) {
  const s = size
  const cx = s / 2
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <rect width={s} height={s} rx={s * 0.08} fill="#1a1a1a"/>
      <polygon points={`0,0 ${cx},0 ${cx * 0.67},${s * 0.39} 0,${s * 0.2}`} fill="#ffffff" stroke="#1a1a1a" strokeWidth="1"/>
      <polygon points={`${s},0 ${cx},0 ${cx * 1.33},${s * 0.39} ${s},${s * 0.2}`} fill="#1565C0" stroke="#1a1a1a" strokeWidth="1"/>
    </svg>
  )
}
