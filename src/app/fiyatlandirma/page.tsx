'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function FiyatlandirmaPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const discount = 0.8

  const prices = {
    marka: billing === 'monthly' ? 12900 : Math.round(12900 * discount),
    premium: billing === 'monthly' ? 24900 : Math.round(24900 * discount),
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-semibold text-ink-900 mb-2">Şirketler için paketler</h1>
          <p className="text-[14px] text-ink-400">Türkiye'nin beyaz yaka kitlesine ulaşın</p>
          <div className="flex items-center justify-center gap-1.5 mt-6 p-1 bg-ink-100 rounded-xl w-fit mx-auto">
            <button onClick={() => setBilling('monthly')} className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${billing === 'monthly' ? 'bg-white text-ink-900 border border-ink-200' : 'text-ink-400'}`}>Aylık</button>
            <button onClick={() => setBilling('yearly')} className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${billing === 'yearly' ? 'bg-white text-ink-900 border border-ink-200' : 'text-ink-400'}`}>
              Yıllık <span className="text-[11px] text-green-600 font-medium">%20 indirim</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl border border-ink-100 p-6">
            <h2 className="text-[16px] font-semibold text-ink-900 mb-1">Temel</h2>
            <p className="text-[32px] font-semibold text-ink-900 mb-1">Ücretsiz</p>
            <p className="text-[13px] text-ink-400 mb-6">Doğrulama sonrası</p>
            <div className="space-y-2.5 mb-8">
              {['Şirket profil sayfası', 'Çalışan yorumlarını görme', 'Doğrulanmış rozet başvurusu'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-700"><span className="text-green-600">✓</span>{f}</div>
              ))}
              {['Sponsored içerik', 'İş ilanı'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-400"><span>✗</span>{f}</div>
cat > src/app/fiyatlandirma/page.tsx << 'DOSYASONU'
'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function FiyatlandirmaPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const discount = 0.8

  const prices = {
    marka: billing === 'monthly' ? 12900 : Math.round(12900 * discount),
    premium: billing === 'monthly' ? 24900 : Math.round(24900 * discount),
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-semibold text-ink-900 mb-2">Şirketler için paketler</h1>
          <p className="text-[14px] text-ink-400">Türkiye'nin beyaz yaka kitlesine ulaşın</p>
          <div className="flex items-center justify-center gap-1.5 mt-6 p-1 bg-ink-100 rounded-xl w-fit mx-auto">
            <button onClick={() => setBilling('monthly')} className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${billing === 'monthly' ? 'bg-white text-ink-900 border border-ink-200' : 'text-ink-400'}`}>Aylık</button>
            <button onClick={() => setBilling('yearly')} className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${billing === 'yearly' ? 'bg-white text-ink-900 border border-ink-200' : 'text-ink-400'}`}>
              Yıllık <span className="text-[11px] text-green-600 font-medium">%20 indirim</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl border border-ink-100 p-6">
            <h2 className="text-[16px] font-semibold text-ink-900 mb-1">Temel</h2>
            <p className="text-[32px] font-semibold text-ink-900 mb-1">Ücretsiz</p>
            <p className="text-[13px] text-ink-400 mb-6">Doğrulama sonrası</p>
            <div className="space-y-2.5 mb-8">
              {['Şirket profil sayfası', 'Çalışan yorumlarını görme', 'Doğrulanmış rozet başvurusu'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-700"><span className="text-green-600">✓</span>{f}</div>
              ))}
              {['Sponsored içerik', 'İş ilanı'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-400"><span>✗</span>{f}</div>
              ))}
            </div>
            <a href="mailto:iletisim@otrsocial.com" className="block text-center text-[13px] font-medium text-ink-900 border border-ink-200 py-2.5 rounded-xl hover:bg-ink-50 transition-colors">Başvur</a>
          </div>

          <div className="bg-white rounded-xl border-2 border-ink-900 p-6 relative">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[11px] font-medium px-4 py-1 rounded-b-lg">En popüler</div>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-1 mt-2">Marka</h2>
            <p className="text-[32px] font-semibold text-ink-900 mb-0">{prices.marka.toLocaleString('tr-TR')} ₺</p>
            <p className="text-[13px] text-ink-400 mb-6">/ay{billing === 'yearly' && <span className="text-green-600 ml-1">· yıllık faturalanır</span>}</p>
            <div className="space-y-2.5 mb-8">
              {['Şirket profil sayfası', 'Çalışan yorumlarını görme', 'Doğrulanmış rozet', '2 sponsored post/ay'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-700"><span className="text-green-600">✓</span>{f}</div>
              ))}
              {['İş ilanı'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-400"><span>✗</span>{f}</div>
              ))}
            </div>
            <a href="mailto:iletisim@otrsocial.com?subject=Marka Paketi" className="block text-center text-[13px] font-medium text-white bg-ink-900 py-2.5 rounded-xl hover:bg-ink-700 transition-colors">Başla</a>
          </div>

          <div className="bg-white rounded-xl border border-ink-100 p-6">
            <h2 className="text-[16px] font-semibold text-ink-900 mb-1">Premium</h2>
            <p className="text-[32px] font-semibold text-ink-900 mb-0">{prices.premium.toLocaleString('tr-TR')} ₺</p>
            <p className="text-[13px] text-ink-400 mb-6">/ay{billing === 'yearly' && <span className="text-green-600 ml-1">· yıllık faturalanır</span>}</p>
            <div className="space-y-2.5 mb-8">
              {['Şirket profil sayfası', 'Çalışan yorumlarını görme', 'Doğrulanmış rozet', '5 sponsored post/ay', '3 sponsored ilan/ay'].map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink-700"><span className="text-green-600">✓</span>{f}</div>
              ))}
            </div>
            <a href="mailto:iletisim@otrsocial.com?subject=Premium Paket" className="block text-center text-[13px] font-medium text-ink-900 border border-ink-200 py-2.5 rounded-xl hover:bg-ink-50 transition-colors">Başla</a>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-[18px] font-semibold text-ink-900 mb-6 text-center">İş ilanı paketleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-ink-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-900">Standart ilan</h3>
                  <p className="text-[13px] text-ink-400 mt-0.5">30 gün · şirket profilinde</p>
                </div>
                <p className="text-[20px] font-semibold text-ink-900">1.990 ₺</p>
              </div>
              <a href="mailto:iletisim@otrsocial.com?subject=Standart İlan" className="block text-center text-[13px] font-medium text-ink-900 border border-ink-200 py-2 rounded-xl hover:bg-ink-50 transition-colors">İlan ver</a>
            </div>
            <div className="bg-white rounded-xl border-2 border-ink-900 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-900">Sponsored ilan</h3>
                  <p className="text-[13px] text-ink-400 mt-0.5">30 gün · profil + feed'de görünür</p>
                </div>
                <p className="text-[20px] font-semibold text-ink-900">4.900 ₺</p>
              </div>
              <a href="mailto:iletisim@otrsocial.com?subject=Sponsored İlan" className="block text-center text-[13px] font-medium text-white bg-ink-900 py-2 rounded-xl hover:bg-ink-700 transition-colors">İlan ver</a>
            </div>
            <div className="bg-white rounded-xl border border-ink-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-900">5'li standart paket</h3>
                  <p className="text-[13px] text-ink-400 mt-0.5">5 ilan · 30 gün her biri · %21 tasarruf</p>
                </div>
                <p className="text-[20px] font-semibold text-ink-900">7.900 ₺</p>
              </div>
              <a href="mailto:iletisim@otrsocial.com?subject=5li Standart Paket" className="block text-center text-[13px] font-medium text-ink-900 border border-ink-200 py-2 rounded-xl hover:bg-ink-50 transition-colors">Paketi al</a>
            </div>
            <div className="bg-white rounded-xl border border-ink-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-900">5'li sponsored paket</h3>
                  <p className="text-[13px] text-ink-400 mt-0.5">5 ilan · 30 gün · feed'de · %27 tasarruf</p>
                </div>
                <p className="text-[20px] font-semibold text-ink-900">17.900 ₺</p>
              </div>
              <a href="mailto:iletisim@otrsocial.com?subject=5li Sponsored Paket" className="block text-center text-[13px] font-medium text-ink-900 border border-ink-200 py-2 rounded-xl hover:bg-ink-50 transition-colors">Paketi al</a>
            </div>
          </div>
        </div>

        <div className="bg-ink-900 rounded-xl p-8 text-center">
          <h2 className="text-[20px] font-semibold text-white mb-2">Kurumsal çözüm mü arıyorsunuz?</h2>
          <p className="text-[13px] text-ink-400 mb-6">Sınırsız ilan, özel destek ve özel fiyatlandırma için bizimle iletişime geçin.</p>
          <a href="mailto:iletisim@otrsocial.com?subject=Kurumsal Görüşme" className="inline-block text-[13px] font-medium text-ink-900 bg-white px-6 py-2.5 rounded-xl hover:bg-ink-100 transition-colors">Görüşme talep et</a>
        </div>
      </div>
      <Footer />
    </>
  )
}
