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
  const [sektor, setSektor] = useState('')
  const [unvan, setUnvan] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [moderating, setModerating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [showNewCompany, setShowNewCompany] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [companies, setCompanies] = useState([] as any[])
  const [imageUrl, setImageUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  useState(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.from('companies').select('id, name').eq('is_approved', true).order('name').then(({ data }) => setCompanies(data || []))
    })
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Gorsel max 5MB olabilir'); return }
    setImageUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { data, error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file, { contentType: file.type })
    if (uploadError) { setError('Görsel yüklenemedi'); setImageUploading(false); return }
    const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName)
    setImageUrl(urlData.publicUrl)
    setImageUploading(false)
  }

  const handleHashtagKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault()
      addHashtag()
    }
  }

  const addHashtag = () => {
    let tag = hashtagInput.trim().replace(/^#/, '')
    if (tag && !hashtags.includes('#' + tag) && hashtags.length < 5) {
      setHashtags([...hashtags, '#' + tag])
      setHashtagInput('')
    }
  }

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(h => h !== tag))
  }

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
        setError(modResult.reason ?? 'Bu içerik yayınlanamaz.')
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('username').eq('id', user?.id ?? '').single()
      const allHashtags = [...new Set([...hashtags, ...(modResult.hashtags ?? [])])]

      let rateToken: string | null = null
      let rateTokenExpiresAt: string | null = null

      if (isAnon) {
        const tokenRes = await fetch('/api/anonymous-token', { method: 'POST' })
        if (!tokenRes.ok) {
          setError('Anonim post için giriş yapmalısın.')
          setLoading(false)
          return
        }
        const tokenData = await tokenRes.json()
        rateToken = tokenData.rate_token
        rateTokenExpiresAt = tokenData.rate_token_expires_at
      }

      const { error: err } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        is_anon: isAnon,
        tag: modResult.category ?? 'Diğer',
        user_id: user?.id ?? null,
        sector: sektor,
        level: unvan,
        vote_count: 0,
        comment_count: 0,
        hashtags: allHashtags,
        sentiment: modResult.sentiment ?? 'neutral',
        company_id: companyId || null,
        company_name: companyName || null,
        author_name: profile?.username || null,
        image_url: imageUrl || null,
        rate_token: isAnon ? rateToken : null,
        rate_token_expires_at: isAnon ? rateTokenExpiresAt : null,
      })

      if (!err) {
        setTitle('')
        setContent('')
        setSektor('')
        setUnvan('')
        setHashtags([])
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
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
            className="flex-1 text-[13px] text-ink-800 placeholder-ink-300 outline-none bg-transparent"
            placeholder="Başlık yaz..." />
        ) : (
          <span className="flex-1 text-[13px] text-ink-300 cursor-text">
            Bir şeyler yaz... (anonim veya adınla)
          </span>
        )}
      </div>

      {expanded && (
        <>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            className="w-full mt-3 text-[13px] text-ink-700 placeholder-ink-300 outline-none bg-transparent resize-none"
            placeholder="Detayları buraya yaz... (opsiyonel)" rows={3} />

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
            <select value={companyId} onChange={e => { if (e.target.value === '__new__') { setShowNewCompany(true); setCompanyId('') } else { setShowNewCompany(false); const opt = companies.find((c: any) => c.id === e.target.value); setCompanyId(e.target.value); setCompanyName(opt?.name ?? '') } }} className="text-[12px] text-ink-600 border border-ink-200 rounded-lg px-2.5 py-1.5 bg-white outline-none col-span-2">
              <option value="">Sirket sec (opsiyonel)</option>
              {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="__new__">+ Listede yok, ekle...</option>
            </select>
            {showNewCompany && (
              <input
                value={newCompany}
                onChange={e => { setNewCompany(e.target.value); setCompanyName(e.target.value) }}
                placeholder="Sirket adini yaz..."
                className="text-[12px] text-ink-600 border border-ink-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-ink-400 col-span-2 mt-1"
              />
            )}
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {hashtags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">
                  {tag}
                  <button onClick={() => removeHashtag(tag)} className="text-ink-400 hover:text-ink-700">✕</button>
                </span>
              ))}
            </div>
            <input
              value={hashtagInput}
              onChange={e => setHashtagInput(e.target.value)}
              onKeyDown={handleHashtagKey}
              onBlur={addHashtag}
              placeholder="Hashtag ekle (Enter ile onayla, max 5)"
              className="w-full text-[12px] text-ink-600 border border-ink-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-ink-400"
            />
          </div>

          <div className="mt-3">
            {imageUrl ? (
              <div className="relative inline-block">
                <img src={imageUrl} alt="preview" className="max-h-48 rounded-lg border border-ink-200 object-cover" />
                <button onClick={() => setImageUrl('')} className="absolute top-1 right-1 w-5 h-5 bg-ink-900 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
              </div>
            ) : (
              <label className="flex items-center gap-1.5 text-[12px] text-ink-400 cursor-pointer hover:text-ink-600 w-fit">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="1" width="12" height="12" rx="2"/><circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" stroke="none"/><path d="M1 9l3-3 2.5 2.5L9 6l4 4"/></svg>
                {imageUploading ? 'Yükleniyor...' : 'Görsel ekle'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
              </label>
            )}
          </div>
          {error && <p className="text-[11px] text-red-500 mt-1.5">{error}</p>}

          <div className="mt-3 pt-3 border-t border-ink-50 flex items-center justify-between flex-wrap gap-2">
            <button onClick={() => setIsAnon(v => !v)}
              className={`flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full border transition-colors ${isAnon ? 'bg-ink-100 text-ink-600 border-ink-200' : 'bg-ink-900 text-white border-ink-900'}`}>
              {isAnon ? 'Anonim' : 'Adımla paylaş'}
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => { setExpanded(false); setError('') }}
                className="text-[12px] text-ink-400 hover:text-ink-700 px-3 py-1.5">
                İptal
              </button>
              <button onClick={handleSubmit} disabled={loading || !title.trim()}
                className="text-[12px] font-medium text-white px-4 py-1.5 rounded-md bg-ink-900 hover:bg-ink-700 transition-colors disabled:opacity-50">
                {moderating ? 'Kontrol ediliyor...' : loading ? 'Yükleniyor...' : 'Paylaş'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}