'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function FiyatlandirmaPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const prices = {
    marka: billing === 'monthly' ? 12900 : 10320,
    premium: billing === 'monthly' ? 24900 : 19920,
  }
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-semibold text-[#0a0a0a] mb-2">Şirketler için paketler</h1>
          <p className="text-[14px] text-ink-400 mb-6">Türkiye'nin beyaz yaka kitlesine ulaşın</p>
          <div className="inline-flex p-1 bg-ink-100 rounded-xl gap-1.5">
            <button onClick={() => setBilling('monthly')} className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${billing === 'monthly' ? 'bg-white text-[#0a0a0a] border border-ink-200' : 'text-ink-400'}`}>Aylık</button>
            <button onClick={() => setBilling('yearly')} className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-colors ${billing === 'yearly' ? 'bg-white text-[#0a0a0a] border border-ink-200' : 'text-ink-400'}`}>Yıllık — %20 indirim</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl border border-[#e0e8f5] p-6">
            <h2 className="text-[16px] font-semibold text-[#0a0a0a] mb-1">Temel</h2>
            <p className="text-[32px] font-semibold text-[#0a0a0a] mb-1">Ücretsiz</p>
            <p className="text-[13px] text-ink-400 mb-6">Doğrulama sonrası</p>
            <div className="space-y-2.5 mb-8 text-[13px]">
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Şirket profil sayfası</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Çalışan yorumlarını görme</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Doğrulanmış rozet başvurusu</div>
              <div className="flex gap-2 text-ink-400"><span>✗</span>Sponsored içerik</div>
              <div className="flex gap-2 text-ink-400"><span>✗</span>İş ilanı</div>
            </div>
            <a href="mailto:info@otrsocial.com" className="block text-center text-[13px] font-medium text-[#0a0a0a] border border-ink-200 py-2.5 rounded-xl hover:bg-[#f0f6ff] transition-colors">Başvur</a>
          </div>
          <div className="bg-white rounded-xl p-6 relative" style={{border:'2px solid #1a1a1a'}}>
            <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#0000FF] text-white text-[11px] font-medium px-4 py-1 rounded-b-lg whitespace-nowrap">En popüler</div>
            <h2 className="text-[16px] font-semibold text-[#0a0a0a] mb-1 mt-2">Marka</h2>
            <p className="text-[32px] font-semibold text-[#0a0a0a]">{prices.marka.toLocaleString('tr-TR')} ₺</p>
            <p className="text-[13px] text-ink-400 mb-6">/ay</p>
            <div className="space-y-2.5 mb-8 text-[13px]">
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Şirket profil sayfası</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Çalışan yorumlarını görme</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Doğrulanmış rozet</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>2 sponsored post/ay</div>
              <div className="flex gap-2 text-ink-400"><span>✗</span>İş ilanı</div>
            </div>
            <a href="mailto:info@otrsocial.com?subject=Marka Paketi" className="block text-center text-[13px] font-medium text-white bg-[#0000FF] py-2.5 rounded-xl hover:bg-[#0000cc] transition-colors">Başla</a>
          </div>
          <div className="bg-white rounded-xl border border-[#e0e8f5] p-6">
            <h2 className="text-[16px] font-semibold text-[#0a0a0a] mb-1">Premium</h2>
            <p className="text-[32px] font-semibold text-[#0a0a0a]">{prices.premium.toLocaleString('tr-TR')} ₺</p>
            <p className="text-[13px] text-ink-400 mb-6">/ay</p>
            <div className="space-y-2.5 mb-8 text-[13px]">
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Şirket profil sayfası</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Çalışan yorumlarını görme</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>Doğrulanmış rozet</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>5 sponsored post/ay</div>
              <div className="flex gap-2 text-ink-700"><span className="text-green-600">✓</span>3 sponsored ilan/ay</div>
            </div>
            <a href="mailto:info@otrsocial.com?subject=Premium Paket" className="block text-center text-[13px] font-medium text-[#0a0a0a] border border-ink-200 py-2.5 rounded-xl hover:bg-[#f0f6ff] transition-colors">Başla</a>
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-[18px] font-semibold text-[#0a0a0a] mb-6 text-center">İş ilanı paketleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#e0e8f5] p-6">
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-[15px] font-semibold text-[#0a0a0a]">Standart ilan</h3><p className="text-[13px] text-ink-400 mt-0.5">30 gün · şirket profilinde</p></div>
                <p className="text-[20px] font-semibold text-[#0a0a0a]">1.990 ₺</p>
              </div>
              <a href="mailto:info@otrsocial.com?subject=Standart İlan" className="block text-center text-[13px] font-medium text-[#0a0a0a] border border-ink-200 py-2 rounded-xl hover:bg-[#f0f6ff] transition-colors">İlan ver</a>
            </div>
            <div className="bg-white rounded-xl p-6" style={{border:'2px solid #1a1a1a'}}>
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-[15px] font-semibold text-[#0a0a0a]">Sponsored ilan</h3><p className="text-[13px] text-ink-400 mt-0.5">30 gün · profil + feed</p></div>
                <p className="text-[20px] font-semibold text-[#0a0a0a]">4.900 ₺</p>
              </div>
              <a href="mailto:info@otrsocial.com?subject=Sponsored İlan" className="block text-center text-[13px] font-medium text-white bg-[#0000FF] py-2 rounded-xl hover:bg-[#0000cc] transition-colors">İlan ver</a>
            </div>
            <div className="bg-white rounded-xl border border-[#e0e8f5] p-6">
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-[15px] font-semibold text-[#0a0a0a]">5'li standart paket</h3><p className="text-[13px] text-ink-400 mt-0.5">5 ilan · 30 gün · %21 tasarruf</p></div>
                <p className="text-[20px] font-semibold text-[#0a0a0a]">7.900 ₺</p>
              </div>
              <a href="mailto:info@otrsocial.com?subject=5li Standart" className="block text-center text-[13px] font-medium text-[#0a0a0a] border border-ink-200 py-2 rounded-xl hover:bg-[#f0f6ff] transition-colors">Paketi al</a>
            </div>
            <div className="bg-white rounded-xl border border-[#e0e8f5] p-6">
              <div className="flex items-start justify-between mb-4">
                <div><h3 className="text-[15px] font-semibold text-[#0a0a0a]">5'li sponsored paket</h3><p className="text-[13px] text-ink-400 mt-0.5">5 ilan · 30 gün · feed · %27 tasarruf</p></div>
                <p className="text-[20px] font-semibold text-[#0a0a0a]">17.900 ₺</p>
              </div>
              <a href="mailto:info@otrsocial.com?subject=5li Sponsored" className="block text-center text-[13px] font-medium text-[#0a0a0a] border border-ink-200 py-2 rounded-xl hover:bg-[#f0f6ff] transition-colors">Paketi al</a>
            </div>
          </div>
        </div>
        <div className="bg-[#0000FF] rounded-xl p-8 text-center">
          <h2 className="text-[20px] font-semibold text-white mb-2">Kurumsal çözüm mü arıyorsunuz?</h2>
          <p className="text-[13px] text-ink-400 mb-6">Sınırsız ilan, özel destek ve özel fiyatlandırma için bizimle iletişime geçin.</p>
          <a href="mailto:info@otrsocial.com?subject=Kurumsal" className="inline-block text-[13px] font-medium text-[#0a0a0a] bg-white px-6 py-2.5 rounded-xl hover:bg-ink-100 transition-colors">Görüşme talep et</a>
        </div>
      </div>
      <Footer />
    </>
  )
}
