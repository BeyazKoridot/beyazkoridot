import Navbar from '@/components/Navbar'

export default function KullanimKosullariPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-[28px] font-semibold text-ink-900 mb-2">Kullanım Koşulları</h1>
        <p className="text-[13px] text-ink-400 mb-8">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

        <div className="space-y-8 text-[14px] text-ink-700 leading-relaxed">

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">1. Kabul</h2>
            <p>Platformu kullanarak bu koşulları kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız platformu kullanmayınız.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">2. Platform Amacı</h2>
            <p>Platform, beyaz yaka çalışanların iş deneyimlerini anonim veya kimlikli olarak paylaşabileceği bir topluluk alanıdır. Platform, kullanıcıların paylaştığı içeriklerden sorumlu değildir.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">3. Yasaklı İçerikler</h2>
            <p className="mb-2">Aşağıdaki içerikler kesinlikle yasaktır:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gerçek kişilere yönelik iftira, hakaret veya tehdit</li>
              <li>Kişisel bilgilerin rızasız paylaşımı (doxxing)</li>
              <li>Nefret söylemi, ayrımcılık içeren ifadeler</li>
              <li>Yanıltıcı veya asılsız bilgi</li>
              <li>Ticari spam ve reklam amaçlı içerik</li>
              <li>Telif hakkı ihlali içeren paylaşımlar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">4. Anonim Paylaşım</h2>
            <p>Anonim paylaşım seçeneği, içeriğin diğer kullanıcılara anonim görünmesi anlamına gelir. Yasal zorunluluk halinde yetkili mercilere bilgi verilebilir.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">5. İçerik Moderasyonu</h2>
            <p>Platform, kurallara aykırı içerikleri önceden bildirmeksizin kaldırma hakkını saklı tutar. Tekrarlayan ihlallerde hesap askıya alınabilir.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">6. Sorumluluk Sınırlaması</h2>
            <p>Platform, kullanıcıların paylaştığı içeriklerden, bu içeriklerin doğruluğundan veya içeriklerin üçüncü şahıslara verdiği zararlardan sorumlu tutulamaz.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">7. Değişiklikler</h2>
            <p>Platform bu koşulları önceden bildirmeksizin değiştirebilir. Değişiklikler yayınlandığı andan itibaren geçerlidir.</p>
          </section>

        </div>
      </div>
    </>
  )
}
