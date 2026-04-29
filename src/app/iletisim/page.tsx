'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: '', email: '', konu: '', mesaj: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.ad || !form.email || !form.mesaj) return
    setLoading(true)
    try {
      const res = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) setSent(true)
    } catch (e) {}
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="mb-10">
          <h1 className="text-[28px] font-semibold text-ink-900 mb-2">İletişim</h1>
          <p className="text-[14px] text-ink-400">Sorularınız, önerileriniz veya iş birliği talepleriniz için bize yazın.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3.5 bg-ink-50 rounded-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400 shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
              <span className="text-[13px] text-ink-700">info@otrsocial.com</span>
            </div>
            <a href="https://linkedin.com/company/otrsocial" target="_blank" className="flex items-center gap-3 p-3.5 bg-ink-50 rounded-xl hover:bg-ink-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-ink-400 shrink-0"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              <span className="text-[13px] text-ink-700">OTR Social — LinkedIn</span>
            </a>
            <div className="mt-4 p-4 border border-ink-100 rounded-xl">
              <p className="text-[13px] font-medium text-ink-900 mb-1">İşletmeler için</p>
              <p className="text-[12px] text-ink-400 leading-relaxed mb-3">Sponsored içerik, iş ilanı ve marka paketleri için fiyatlandırma sayfamızı inceleyin.</p>
              <a href="/fiyatlandirma" className="text-[12px] font-medium text-ink-900 border border-ink-200 px-4 py-2 rounded-lg hover:bg-ink-50 transition-colors">Paketleri gör →</a>
            </div>
          </div>
          <div className="bg-white border border-ink-100 rounded-xl p-6 flex flex-col gap-3">
            {sent ? (
              <div className="text-center py-8">
                <p className="text-[15px] font-medium text-ink-900 mb-2">Teşekkürler!</p>
                <p className="text-[13px] text-ink-400">Mesajınız iletildi, en kısa sürede dönüş yapacağız.</p>
              </div>
            ) : (
              <>
                <input type="text" placeholder="Adınız *" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors" />
                <input type="email" placeholder="E-posta adresiniz *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors" />
                <select value={form.konu} onChange={e => setForm({...form, konu: e.target.value})} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors">
                  <option value="">Konu seçin</option>
                  <option>Marka iş birliği</option>
                  <option>Teknik destek</option>
                  <option>Basın ve medya</option>
                  <option>Diğer</option>
                </select>
                <textarea placeholder="Mesajınız *" rows={5} value={form.mesaj} onChange={e => setForm({...form, mesaj: e.target.value})} className="w-full text-[13px] px-3 py-2.5 border border-ink-200 rounded-xl bg-ink-50 text-ink-900 outline-none focus:border-ink-400 transition-colors resize-none" />
                <button onClick={handleSubmit} disabled={loading} className="w-full py-2.5 text-[13px] font-medium text-white bg-ink-900 rounded-xl hover:bg-ink-700 disabled:opacity-50 transition-colors">
                  {loading ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
