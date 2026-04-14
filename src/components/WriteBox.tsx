'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const SEKTORLER = ['Teknoloji', 'Finans', 'Pazarlama', 'Danışmanlık', 'İnsan kaynakları', 'E-ticaret', 'Medya', 'Hukuk', 'Diğer']
const UNVANLAR = ['Stajyer', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'C-level']

export default function WriteBox({ onPost }: { onPost?: () => void }) {
  const [isAnon, setIsAnon] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('Çalışma kültürü')
  const [sektor, setSektor] = useState('')
  const [unvan, setUnvan] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [moderating, setModerating] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    if (!sektor) { setError('Lütfen sektörünü seç'); return }
    setError('')
    setLoading(true)
    setModerating(true)

    try {
      const modResponse = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: title + ' ' + content })
      })
      const modResult = await modResponse.json()
      setModerating(false)

      if (!modResult.approved) {
        setError(modResult.reason ?? 'Bu içerik yayınlanamaz. Lütfen içeriğini gözden geçir.')
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      const { error: err } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        is_anon: isAnon,
        tag: modResult.category ?? tag,
        user_id: user?.id ?? null,
        sector: sektor,
        level: unvan,
        vote_count: 0,
        comment_count: 0,
        hashtags: modResult.hashtags ?? [],
        sentiment: modResult.sentiment ?? 'neutral',
      })

      if (!err) {
        setTitle('')
        setContent('')
        setSektor('')
        setUnvan('')
        setExpanded(false)
        setSuccess(true)
        onPost?.()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (e) {
      setError('Bir hata oluştu, tekrar dene.')
    }

    setLoading(false)
  }

  return (
    <div className={`bg-white rounded-xl border mb-4 ${expanded ? 'border-ink-400' : 'border-ink-100'} p-3.5 transition-colors`}>
      {success && (
        <div className="mb-3 px-3 py-2 bg-green-50 text-green-700 text-[12px] rounded-lg">
          Gönderin yayınlandı!
        </div>
      )}

      <div className="flex items-center gap-3" onClick={() => setExpanded(true)}>
        <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center shrink-0">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="5.5" r="2.8" stroke="#888780" strokeWidth="1.2"/>
            <path d="M2 13c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5" stroke="#888780" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        {expanded ? (
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 text-[13px] text-ink-800 placeholder-ink-300 outline-none bg-transparent"
            placeholder="Başlık yaz..."
          />
        ) : (
          <span className="flex-1 text-[13px] text-ink-300 cursor-text">
            Bir şeyler yaz... (anonim veya adınla)
          </span>
        )}
      </div>

      {expanded && (
        <>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full mt-3 text-[13px] text-ink-700 placeholder-ink-300 outline-none bg-transparent resize-none"
            placeholder="Detayları buraya yaz... (opsiyonel)"
            rows={3}
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <select value={sektor} onChange={e => setSektor(e.target.value)}
              className="text-[12px] text-ink-600 border border-ink-200 rounded-lg px-2.5 py-1.5 bg-white outline-none">
              <option value="">Sektör seç *</option>
              {SEKTORLER.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={unvan} onChange={e => setUnvan(e.target.value)}
              className="text-[12px] text-ink-600 border border-ink-200 rounded-lg px-2.5 py-1.5 bg-white outline-none">
              <option value="">Unvan seviyesi</option>
              {UNVANLAR.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}

          <div className="mt-3 pt-3 border-t border-ink-50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAnon(v => !v)}
                className={`flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full border transition-colors ${isAnon ? 'bg-ink-100 text-ink-600 border-ink-200' : 'bg-ink-900 text-white border-ink-900'}`}
              >
                {isAnon ? 'Anonim' : 'Adımla paylaş'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setExpanded(false); setError('') }}
                className="text-[12px] text-ink-400 hover:text-ink-700 px-3 py-1.5">
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !title.trim()}
                className="text-[12px] font-medium text-white px-4 py-1.5 rounded-md bg-ink-900 hover:bg-ink-700 transition-colors disabled:opacity-50"
              >
                {moderating ? 'Kontrol ediliyor...' : loading ? 'Yükleniyor...' : 'Paylaş'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}