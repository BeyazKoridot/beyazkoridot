'use client'
import { useState } from 'react'
import { supabaseBrowser as supabase } from '@/lib/supabase-browser'

const SEKTORLER = ['Teknoloji', 'Finans', 'Pazarlama', 'Danışmanlık', 'İnsan kaynakları', 'E-ticaret', 'Medya', 'Hukuk', 'Diğer']
const UNVANLAR = ['Stajyer', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'C-level']

type Props = { onClose: () => void; defaultMode?: 'login' | 'register'; isForced?: boolean }

export default function AuthModal({ onClose, defaultMode = 'login', isForced = false }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [step, setStep] = useState<'auth' | 'profile'>('auth')
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [sektor, setSektor] = useState('')
  const [unvan, setUnvan] = useState('')
  const [kvkk, setKvkk] = useState(false)
  const [kullanim, setKullanim] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const handleAuth = async () => {
    setError('')
    if (mode === 'register') {
      if (!displayName.trim()) { setError('Kullanıcı adı zorunlu'); return }
      if (!kvkk || !kullanim) { setError('Lütfen koşulları kabul et'); return }
    }
    setLoading(true)
    if (mode === 'register') {
      const { data, error: err } = await supabase.auth.signUp({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      await supabase.from('profiles').upsert({
        id: data.user?.id,
        username: displayName,
        kvkk_accepted: true,
        terms_accepted: true,
        accepted_at: new Date().toISOString(),
      })
      setUserId(data.user?.id || '')
      setStep('profile')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError('E-posta veya şifre hatalı')
      else onClose()
    }
    setLoading(false)
  }

  const handleProfileSave = async () => {
    if (userId) {
      await supabase.from('profiles').update({ sector: sektor, level: unvan }).eq('id', userId)
    }
    onClose()
  }

  if (step === 'profile') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md" onClick={isForced ? undefined : onClose}>
        <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-ink-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-[8px] font-bold text-ink-900">OTR</span>
              </div>
              <span className="text-[13px] font-medium text-white">Off The Record <span className="text-white/35 font-normal">Social</span></span>
            </div>
            <div className="flex gap-1">
              <div className="w-5 h-[3px] bg-white rounded-full"></div>
              <div className="w-5 h-[3px] bg-white/25 rounded-full"></div>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-[17px] font-medium text-ink-900 mb-1">Seni biraz tanıyalım.</p>
              <p className="text-[13px] text-ink-400 leading-relaxed">Feed'ini kişiselleştirmek için sektörünü ve seviyeni seç. İstediğin zaman değiştirebilirsin.</p>
            </div>
            <div>
              <p className="text-[12px] font-medium text-ink-600 mb-2">Sektörün</p>
              <div className="flex flex-wrap gap-1.5">
                {SEKTORLER.map(s => (
                  <button key={s} onClick={() => setSektor(s)} className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${sektor === s ? 'bg-ink-900 text-white border-ink-900' : 'border-ink-200 text-ink-500 hover:border-ink-400'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-ink-600 mb-2">Seviyeni</p>
              <div className="flex flex-wrap gap-1.5">
                {UNVANLAR.map(u => (
                  <button key={u} onClick={() => setUnvan(u)} className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${unvan === u ? 'bg-ink-900 text-white border-ink-900' : 'border-ink-200 text-ink-500 hover:border-ink-400'}`}>{u}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={onClose} className="flex-1 py-2.5 text-[13px] text-ink-400 border border-ink-200 rounded-xl hover:bg-ink-50 transition-colors">Şimdi değil</button>
              <button onClick={handleProfileSave} className="flex-[2] py-2.5 text-[13px] font-medium text-white bg-ink-900 rounded-xl hover:bg-ink-700 transition-colors">Devam et →</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-ink-900 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-[8px] font-bold text-ink-900">OTR</span>
              </div>
              <span className="text-[13px] font-medium text-white">Off The Record <span className="text-white/35 font-normal">Social</span></span>
            </div>
            {!isForced && <button onClick={onClose} className="text-white/30 hover:text-white/60 text-lg">✕</button>}
          </div>
          {mode === 'register' && (
            <>
              <p className="text-[14px] text-white/80 leading-relaxed mb-2">Maaşını sormak ayıp sayıldı. Şirket kültürünü sorgulamak imkânsızdı. Kariyer krizini paylaşmak zayıflık görüldü. OTR Social bunu değiştirmek için burada.</p>
              <p className="text-[12px] text-white/30 italic">Kayıt dışı ama etki içinde.</p>
            </>
          )}
          {mode === 'login' && (
            <p className="text-[15px] font-medium text-white">Tekrar hoş geldin.</p>
          )}
        </div>

        <div className="p-6 flex flex-col gap-3">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-ink-200 rounded-xl text-[13px] font-medium hover:bg-ink-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Google ile devam et
          </button>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-ink-100"></div>
            <span className="text-[11px] text-ink-300">veya</span>
            <div className="flex-1 h-px bg-ink-100"></div>
          </div>
          {mode === 'register' && (
            <input type="text" placeholder="Kullanıcı adı *" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors" />
          )}
          <input type="email" placeholder="E-posta *" value={email} onChange={e => setEmail(e.target.value)} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors" />
          <input type="password" placeholder="Şifre *" value={password} onChange={e => setPassword(e.target.value)} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors" />
          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={kvkk} onChange={e => setKvkk(e.target.checked)} className="mt-0.5 shrink-0" />
                <span className="text-[11px] text-ink-400"><a href="/kvkk" target="_blank" className="underline text-ink-600">KVKK Aydınlatma Metni</a>'ni okudum, kabul ediyorum.</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={kullanim} onChange={e => setKullanim(e.target.checked)} className="mt-0.5 shrink-0" />
                <span className="text-[11px] text-ink-400"><a href="/kullanim-kosullari" target="_blank" className="underline text-ink-600">Kullanım Koşulları</a>'nı okudum, kabul ediyorum.</span>
              </label>
            </div>
          )}
          {error && <p className="text-[11px] text-red-500">{error}</p>}
          <button onClick={handleAuth} disabled={loading} className="w-full py-2.5 text-[13px] font-medium text-white bg-ink-900 rounded-xl hover:bg-ink-700 disabled:opacity-50 transition-colors">
            {loading ? 'Yükleniyor...' : mode === 'register' ? 'Üye ol — ücretsiz' : 'Giriş yap'}
          </button>
          <p className="text-center text-[11px] text-ink-400">
            {mode === 'register' ? 'Zaten üye misin?' : 'Hesabın yok mu?'}{' '}
            <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }} className="text-ink-900 font-medium underline">
              {mode === 'register' ? 'Giriş yap' : 'Üye ol'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
