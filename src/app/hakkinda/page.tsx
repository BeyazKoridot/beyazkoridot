import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function HakkindaPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">

        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-ink-900 leading-tight mb-4">
            LinkedIn'de söyleyemediklerini burada söyle.
          </h1>
          <p className="text-[16px] text-ink-600 leading-relaxed">
            Mevcut veya potansiyel müdürün görmesin diye maaşını paylaşamıyor musun? 
            İş arkadaşların duysun istemediğin için burnout'unu yazamıyor musun? 
            Bu platform tam bunun için var.
          </p>
        </div>

        <div className="space-y-10">

          <section>
            <h2 className="text-[18px] font-semibold text-ink-900 mb-3">Ne yapabilirsin?</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: '💬', title: 'Deneyimlerini paylaş', desc: 'Çalışma kültürü, yönetim tarzı, ofis ortamı — anonim veya adınla.' },
                { icon: '💰', title: 'Maaşını paylaş', desc: 'Sektörünüzde şeffaflık yaratalım. Unvan ve yıl bazlı gerçek rakamlar.' },
                { icon: '🔥', title: 'Burnout\'unu anlat', desc: 'Baskı, mesai, haksız uygulamalar. Yargılanmadan, güvenle.' },
                { icon: '📊', title: 'Anketlere katıl', desc: 'Remote politikaları, maaş beklentileri, sektör nabzı.' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-ink-100">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-[14px] font-medium text-ink-900 mb-1">{item.title}</p>
                    <p className="text-[13px] text-ink-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-ink-900 mb-3">Anonim paylaşım nasıl çalışır?</h2>
            <p className="text-[14px] text-ink-600 leading-relaxed mb-3">
              Her gönderi ve yorumda "anonim" seçeneğini işaretleyebilirsin. 
              Anonim paylaşımlarda diğer kullanıcılar sadece sektörünü ve unvan seviyeni görür — 
              ismini, e-postanı veya kim olduğunu asla göremezler.
            </p>
            <p className="text-[14px] text-ink-600 leading-relaxed">
              Sektör bilgisi gösterilmesinin sebebi içeriğe bağlam katmak — 
              "Teknoloji · Senior Engineer" yazan bir yorumun değeri çok daha yüksek.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-ink-900 mb-3">Kimler için?</h2>
            <p className="text-[14px] text-ink-600 leading-relaxed">
              Türkiye'deki tüm beyaz yaka çalışanlar için. Yazılımcıdan finans profesyoneline, 
              pazarlama uzmanından danışmana — ofiste, hibrid veya remote çalışan herkes.
            </p>
          </section>

          <section className="bg-ink-900 rounded-2xl p-8 text-center">
            <h2 className="text-[20px] font-bold text-white mb-3">Topluluğa katıl</h2>
            <p className="text-[14px] text-ink-300 mb-6">Ücretsiz, anonim, güvenli.</p>
            <a href="/" className="inline-block px-8 py-3 bg-white text-ink-900 rounded-xl text-[14px] font-semibold hover:bg-ink-100 transition-colors">
              Platforma git →
            </a>
          </section>

        </div>
      </div>
      <Footer />
    </>
  )
}
