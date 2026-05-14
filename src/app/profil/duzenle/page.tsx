'use client'
import { useState, useEffect, useRef } from 'react'
import { supabaseBrowser as supabase } from '@/lib/supabase-browser'
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

  const [workEmail, setWorkEmail] = useState('')
  const [workEmailVerified, setWorkEmailVerified] = useState(false)
  const [existingWorkEmail, setExistingWorkEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [workEmailLoading, setWorkEmailLoading] = useState(false)
  const [workEmailError, setWorkEmailError] = useState('')
  const [workEmailSuccess, setWorkEmailSuccess] = useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) { window.location.href = '/profil'; return }
      setUser(session.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (p) {
        setUsername(p.username ?? '')
        setSektor(p.sector ?? '')
        setUnvan(p.level ?? '')
        setAvatarUrl(p.avatar_url ?? null)
        setWorkEmailVerified(p.work_email_verified ?? false)
        setExistingWorkEmail(p.work_email ?? '')
      }
    })
    return () => subscription.unsubscribe()
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

  const handleSendOtp = async () => {
    setWorkEmailError('')
    setWorkEmailSuccess('')
    setWorkEmailLoading(true)
    const res = await fetch('/api/verify-work-email/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, workEmail }),
    })
    const data = await res.json()
    if (!res.ok) {
      setWorkEmailError(data.error ?? 'Bir hata oluştu')
    } else {
      setOtpSent(true)
      setWorkEmailSuccess('Kod gönderildi! E-postanı kontrol et.')
    }
    setWorkEmailLoading(false)
  }

  const handleConfirmOtp = async () => {
    setWorkEmailError('')
    setWorkEmailLoading(true)
    const res = await fetch('/api/verify-work-email/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, otp }),
    })
    const data = await res.json()
    if (!res.ok) {
      setWorkEmailError(data.error ?? 'Bir hata oluştu')
    } else {
      setWorkEmailVerified(true)
      setExistingWorkEmail(workEmail)
      setOtpSent(false)
      setOtp('')
      setWorkEmail('')
      setWorkEmailSuccess('İş e-postanız doğrulandı! Doğrulanmış rozetini kazandın.')
    }
    setWorkEmailLoading(false)
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

        {/* İş e-postası doğrulama bölümü */}
        <div className="bg-white rounded-xl border border-ink-100 p-6 mt-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[14px] font-semibold text-ink-900">İş e-postası doğrulama</h2>
              <p className="text-[12px] text-ink-400 mt-0.5 leading-relaxed">
                Kurumsal e-postanı doğrula, profilinde "Doğrulanmış" rozeti kazan.
              </p>
            </div>
            {workEmailVerified && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full shrink-0 ml-3">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Doğrulanmış
              </span>
            )}
          </div>

          {workEmailVerified ? (
            <div className="px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-[12px] text-blue-800">
                <span className="font-medium">{existingWorkEmail}</span> doğrulandı.
              </p>
            </div>
          ) : (
            <>
              {!otpSent ? (
                <div className="space-y-3">
                  {existingWorkEmail && (
                    <p className="text-[11px] text-ink-400">Mevcut: {existingWorkEmail} (henüz doğrulanmamış)</p>
                  )}
                  <input
                    type="email"
                    value={workEmail}
                    onChange={e => setWorkEmail(e.target.value)}
                    placeholder="isim@sirket.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400"
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={workEmailLoading || !workEmail}
                    className="w-full py-2.5 bg-ink-900 text-white rounded-xl text-[13px] font-medium hover:bg-ink-700 transition-colors disabled:opacity-50"
                  >
                    {workEmailLoading ? 'Gönderiliyor...' : 'Doğrulama kodu gönder'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[12px] text-ink-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                    <span className="font-medium">{workEmail}</span> adresine 6 haneli kod gönderildi.
                  </p>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[15px] text-center tracking-widest font-mono outline-none focus:border-ink-400"
                  />
                  <button
                    onClick={handleConfirmOtp}
                    disabled={workEmailLoading || otp.length !== 6}
                    className="w-full py-2.5 bg-ink-900 text-white rounded-xl text-[13px] font-medium hover:bg-ink-700 transition-colors disabled:opacity-50"
                  >
                    {workEmailLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(''); setWorkEmailError(''); setWorkEmailSuccess('') }}
                    className="w-full text-[12px] text-ink-400 hover:text-ink-700"
                  >
                    Farklı e-posta dene
                  </button>
                </div>
              )}
              {workEmailError && <p className="text-[11px] text-red-500">{workEmailError}</p>}
              {workEmailSuccess && <p className="text-[11px] text-green-600">{workEmailSuccess}</p>}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
