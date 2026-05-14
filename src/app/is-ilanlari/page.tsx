import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Beyaz Yaka İş İlanları — Türkiye | OTR Social',
  description: 'Türkiye\'de teknoloji, finans ve diğer sektörlerde güncel beyaz yaka iş ilanları. OTR Social\'da kariyer fırsatlarını keşfet.',
}

export default function IsIlanariPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="rounded-2xl overflow-hidden border border-ink-100">
          <div className="bg-ink-900 px-8 py-16 text-center">
            <span className="inline-block text-[11px] font-medium text-white/40 border border-white/15 px-4 py-1 rounded-full mb-6 tracking-widest">YAKINDA</span>
            <h1 className="text-[26px] font-semibold text-white leading-snug mb-4 max-w-lg mx-auto">OTR Social'da henüz kimse iş ilanı vermedi.<br/>İlk siz olun.</h1>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-md mx-auto mb-8">İş ilanları yakında açılıyor. Türkiye'nin en karar verici, en sorgulayan, en zor ikna olan beyaz yaka kitlesine — tam da kariyer kararı verdikleri anda — ulaşmak isteyen markalar için.</p>
            <a href="mailto:info@otrsocial.com?subject=İş İlanı Erken Erişim" className="inline-block bg-white text-ink-900 text-[13px] font-medium px-6 py-2.5 rounded-xl hover:bg-ink-100 transition-colors">Erken erişim için bize yazın →</a>
            <p className="text-[12px] text-white/25 mt-5 italic">Yanıt süresi: 24 saat. Spam süresi: sıfır.</p>
          </div>
          <div className="bg-white px-8 py-6 grid grid-cols-3 gap-4 border-t border-ink-100">
            {[
              { sayi: '4.2K+', label: 'aktif kullanıcı' },
              { sayi: '200+', label: 'şirket profili' },
              { sayi: '%100', label: 'beyaz yaka kitle' },
            ].map(item => (
              <div key={item.label} className="p-4 border border-ink-100 rounded-xl">
                <p className="text-[22px] font-semibold text-ink-900 mb-1">{item.sayi}</p>
                <p className="text-[12px] text-ink-400">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-ink-50 px-8 py-6 border-t border-ink-100">
            <p className="text-[12px] font-medium text-ink-900 mb-4">Sponsorlu ilan nasıl çalışır?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { n: '1', baslik: 'İlanınızı oluşturun', aciklama: 'Pozisyon, kapsam ve maaş aralığını ekleyin' },
                { n: '2', baslik: "Feed'de görünün", aciklama: 'Sponsorlu ilan olarak ana akışa girer' },
                { n: '3', baslik: 'Doğru adaya ulaşın', aciklama: 'Zaten iş dünyasını sorgulayan kitle' },
              ].map(item => (
                <div key={item.n} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-ink-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-[11px] font-medium">{item.n}</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-ink-900 mb-0.5">{item.baslik}</p>
                    <p className="text-[11px] text-ink-400 leading-relaxed">{item.aciklama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
