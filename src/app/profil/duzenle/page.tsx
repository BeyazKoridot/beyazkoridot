'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SEKTORLER = ['Teknoloji', 'Finans', 'Pazarlama', 'Danışmanlık', 'İnsan kaynakları', 'E-ticaret', 'Medya', 'Hukuk', 'Diğer']
const UNVANLAR = ['Stajyer', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'C-level']

export default function ProfilDuzenle() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [sektor, setSektor] = useState('')
  const [unvan, setUnvan] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/profil'; return }
      setUser(user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (p) {
        setUsername(p.username ?? '')
        setSektor(p.sector ?? '')
        setUnvan(p.level ?? '')
        setAvatarUrl(p.avatar_url ?? null)
      }
    }
    fetchProfile()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: user.id,
      username: username || null,
      sector: sektor,
      level: unvan,
      avatar_url: avatarUrl,
    })
    setSaving(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); window.location.href = '/profil' }, 1500)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => window.location.href = '/profil'} className="text-[13px] text-ink-400 hover:text-ink-700">← Geri</button>
          <h1 className="text-[18px] font-bold text-ink-900">Profili düzenle</h1>
        </div>

        <div className="bg-white rounded-xl border border-ink-100 p-6 space-y-5">

          <div className="flex flex-col items-center gap-3">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-full bg-ink-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-ink-200 hover:border-ink-400 transition-colors relative"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#888" strokeWidth="1.5">
                  <circle cx="14" cy="10" r="5"/><path d="M5 24c0-5 4-9 9-9s9 4 9 9" strokeLinecap="round"/>
                </svg>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-[11px]">Yükleniyor...</span>
                </div>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()} className="text-[12px] text-ink-500 hover:text-ink-800">
              Fotoğraf değiştir
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          <div>
            <label className="text-[12px] font-medium text-ink-600 mb-1.5 block">İsim (opsiyonel)</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Görünür ismin"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-ink-600 mb-1.5 block">Sektör *</label>
            <select
              value={sektor}
              onChange={e => setSektor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400 bg-white"
            >
              <option value="">Seç...</option>
              {SEKTORLER.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-medium text-ink-600 mb-1.5 block">Unvan seviyesi</label>
            <select
              value={unvan}
              onChange={e => setUnvan(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400 bg-white"
            >
              <option value="">Seç...</option>
              {UNVANLAR.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          {success && <p className="text-[12px] text-green-600 text-center">Kaydedildi! Yönlendiriliyorsunuz...</p>}

          <button
            onClick={handleSave}
            disabled={saving || !sektor}
            className="w-full py-3 bg-ink-900 text-white rounded-xl text-[14px] font-semibold hover:bg-ink-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
