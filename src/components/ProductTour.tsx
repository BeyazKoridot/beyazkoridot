'use client'
import { useState, useEffect } from 'react'

const STEPS = [
  {
    title: 'İlk paylaşımını yap',
    desc: 'Anonim veya adınla — tamamen sana kalmış.',
    target: 'writebox',
    position: 'bottom',
  },
  {
    title: 'Maaş rehberini gör',
    desc: 'Sektörüne göre gerçek maaş verileri.',
    target: 'maas-link',
    position: 'bottom',
  },
  {
    title: 'Şirketleri keşfet',
    desc: '200+ şirkette çalışan deneyimleri.',
    target: 'sirket-link',
    position: 'bottom',
  },
  {
    title: 'Maaşını paylaş',
    desc: 'Şeffaflığa katkıda bulun.',
    target: 'maas-ekle',
    position: 'top',
  },
]

export default function ProductTour({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    const target = document.getElementById(STEPS[step].target)
    if (target) {
      const rect = target.getBoundingClientRect()
      setPos({ top: rect.top + window.scrollY, left: rect.left, width: rect.width })
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [step])

  const finish = () => {
    localStorage.setItem('otr_tour_done', '1')
    onDone()
  }

  const current = STEPS[step]
  const isBottom = current.position === 'bottom'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={finish} />
      <div
        className="fixed z-50 bg-white rounded-2xl p-5 shadow-xl w-72"
        style={{
          top: isBottom ? pos.top + 60 : pos.top - 160,
          left: Math.max(16, Math.min(pos.left, window.innerWidth - 304)),
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-ink-900' : 'w-3 bg-ink-200'}`} />
            ))}
          </div>
          <button onClick={finish} className="text-ink-300 hover:text-ink-600 text-sm">✕</button>
        </div>
        <p className="text-[14px] font-medium text-ink-900 mb-1">{current.title}</p>
        <p className="text-[12px] text-ink-400 mb-4 leading-relaxed">{current.desc}</p>
        <div className="flex items-center justify-between">
          <button onClick={finish} className="text-[12px] text-ink-400 hover:text-ink-600">Atla</button>
          <button
            onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : finish()}
            className="text-[12px] font-medium text-white bg-ink-900 px-4 py-1.5 rounded-lg hover:bg-ink-700 transition-colors"
          >
            {step < STEPS.length - 1 ? 'Devam et →' : 'Başla!'}
          </button>
        </div>
      </div>
    </>
  )
}
