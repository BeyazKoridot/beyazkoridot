'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const SEKTORLER = ['Teknoloji', 'Finans', 'Pazarlama', 'Danışmanlık', 'İnsan kaynakları', 'E-ticaret', 'Medya', 'Hukuk', 'Diğer']
const UNVANLAR = ['Stajyer', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'C-level']

type Props = { onClose: () => void; defaultMode?: 'login' | 'register' }

export default function AuthModal({ onClose, defaultMode = 'login' }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [sektor, setSektor] = useState('')
  const [unvan, setUnvan] = useState('')
  const [kvkk, setKvkk] = useState(false)
  const [kullanim, setKullanim] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleEmailAuth = async () => {
    if (mode === 'register') {
      if (!sektor) { setError('Lütfen sektörünü seç'); return }
      if (!kvkk) { setError('KVKK Aydınlatma Metni\'ni kabul etmen gerekiyor'); return }
      if (!kullanim) { setError('Kullanım Koşulları\'nı kabul etmen gerekiyor'); return }
    }
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'register') {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            sector: sektor,
            level: unvan,
          }
        }
      })
      if (err) setError(err.message)
      else {
        await supabase.from('profiles').upsert({
          id: data.user?.id,
          username: displayName || null,
          sector: sektor,
          level: unvan,
          kvkk_accepted: true,
          terms_accepted: true,
          accepted_at: new Date().toISOString(),
        })
        setMessage('E-postanı kontrol et — onay linki gönderdik!')
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError('E-posta veya şifre hatalı')
      else onClose()
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-ink-900">{mode === 'login' ? 'Giriş yap' : 'Üye ol'}</h2>
            <p className="text-[12px] text-ink-400 mt-0.5">{mode === 'login' ? 'Hesabına giriş yap' : 'Topluluğa katıl'}</p>
          </div>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-600 text-xl">✕</button>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-ink-200 rounded-xl text-[13px] font-medium hover:bg-ink-50 mb-4 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Google ile {mode === 'login' ? 'giriş yap' : 'üye ol'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-ink-100" />
          <span className="text-[12px] text-ink-300">veya e-posta ile</span>
          <div className="flex-1 h-px bg-ink-100" />
        </div>

        <div className="space-y-3 mb-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="İsim (opsiyonel — görünür ismin olur)"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400"
            />
          )}
          <input
            type="email"
            placeholder="E-posta adresin"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400"
            onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
          />

          {mode === 'register' && (
            <>
              <select
                value={sektor}
                onChange={e => setSektor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400 bg-white text-ink-600"
              >
                <option value="">Sektörün nedir? *</option>
                {SEKTORLER.map(s => <option key={s}>{s}</option>)}
              </select>
              <select
                value={unvan}
                onChange={e => setUnvan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ink-200 text-[13px] outline-none focus:border-ink-400 bg-white text-ink-600"
              >
                <option value="">Unvan seviyesi (opsiyonel)</option>
                {UNVANLAR.map(u => <option key={u}>{u}</option>)}
              </select>
              <p className="text-[11px] text-ink-400 px-1">Sektör bilgin anonim paylaşımlarda bile görünür — kimliğini değil, bağlamını gösterir.</p>

              <div className="border border-ink-100 rounded-xl p-3 space-y-2.5 bg-ink-50">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kvkk}
                    onChange={e => setKvkk(e.target.checked)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] text-ink-600 leading-relaxed">
                    <a href="/kvkk" target="_blank" className="text-ink-900 font-medium underline underline-offset-2">KVKK Aydınlatma Metni</a>'ni okudum ve kişisel verilerimin işlenmesine açık rıza gösteriyorum. *
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kullanim}
                    onChange={e => setKullanim(e.target.checked)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] text-ink-600 leading-relaxed">
                    <a href="/kullanim-kosullari" target="_blank" className="text-ink-900 font-medium underline underline-offset-2">Kullanım Koşulları</a>'nı ve <a href="/kvkk" target="_blank" className="text-ink-900 font-medium underline underline-offset-2">Gizlilik Politikası</a>'nı kabul ediyorum. *
                  </span>
                </label>
                <p className="text-[10px] text-ink-400 pt-1 border-t border-ink-200">
                  Paylaştığın içerikler ve maaş verileri gönüllülük esasına dayanmaktadır. Platform, bu verilerin doğruluğunu taahhüt etmez.
                </p>
              </div>
            </>
          )}
        </div>

        {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
        {message && <p className="text-[12px] text-green-600 mb-3">{message}</p>}

        <button
          onClick={handleEmailAuth}
          disabled={loading || !email || !password}
          className="w-full py-2.5 rounded-xl bg-ink-900 text-white text-[13px] font-medium hover:bg-ink-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Yükleniyor...' : mode === 'login' ? 'Giriş yap' : 'Üye ol'}
        </button>

        <p className="text-center text-[12px] text-ink-400 mt-4">
          {mode === 'login' ? 'Hesabın yok mu?' : 'Zaten üye misin?'}
          {' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}
            className="text-ink-800 font-medium hover:underline"
          >
            {mode === 'login' ? 'Üye ol' : 'Giriş yap'}
          </button>
        </p>
      </div>
    </div>
  )
}
