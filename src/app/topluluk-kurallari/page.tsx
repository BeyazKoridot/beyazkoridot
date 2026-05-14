import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Topluluk Kuralları | OTR Social',
  description: 'OTR Social topluluk kuralları, izin verilen ve yasak içerikler, içerik kaldırma süreci.',
}

export default function ToplulukKurallariPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-[28px] font-semibold text-ink-900 mb-2">Topluluk Kuralları</h1>
        <p className="text-[13px] text-ink-400 mb-8">Son güncelleme: Mayıs 2026</p>

        <div className="space-y-8 text-[14px] text-ink-700 leading-relaxed">

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">OTR Social nedir?</h2>
            <p>
              OTR Social, Türkiye'deki beyaz yaka çalışanların iş deneyimlerini özgürce paylaşabildiği bir platformdur.
              Anonim veya isimli paylaşım yapılabilir. Amacımız sektördeki gerçek deneyimleri görünür kılmak,
              bilgiye erişimi demokratikleştirmektir.
            </p>
          </section>

          <section>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <h2 className="text-[15px] font-semibold text-emerald-800 mb-3">✓ Platformda bunlar serbesttir</h2>
              <ul className="space-y-2 text-emerald-900">
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>İş ve mülakat deneyimlerini paylaşmak (olumlu veya olumsuz)</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Maaş ve yan haklar bilgisi paylaşmak</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Şirket veya sektör eleştirisi yapmak (kişi isimleri olmadan)</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>İşveren ayrımcılığını anlatmak (hamilelik sorusu, medeni durum sorusu vb.)</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Burnout, tükenmişlik ve stres paylaşmak</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Kariyer tavsiyesi istemek veya vermek</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Hayal kırıklığı ve öfkeyi yapıcı bir dille ifade etmek</span></li>
              </ul>
            </div>
          </section>

          <section>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-[15px] font-semibold text-red-800 mb-3">✗ Platformda bunlar yasaktır</h2>
              <ul className="space-y-2 text-red-900">
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Gerçek kişilere yönelik iftira, hakaret veya açık tehdit</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Kişisel bilgileri rızasız paylaşmak (TC kimlik no, telefon, adres — doxxing)</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Nefret söylemi: ırk, din, cinsiyet, etnik köken veya engellilik temelinde ayrımcılık</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Küfür ve ağır argo kullanımı</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Yanıltıcı veya kasıtlı olarak yanlış bilgi yaymak</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Ticari spam, reklam amaçlı veya ücretli içerik</span></li>
                <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Telif hakkı ihlali içeren paylaşımlar</span></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">Moderasyon nasıl çalışır?</h2>
            <p className="mb-3">
              Her paylaşım yayınlanmadan önce otomatik moderasyon sisteminden geçer. Sistem iki katmanlıdır:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Hızlı anahtar kelime filtresi — açık ihlaller anında engellenir</li>
              <li>Yapay zeka analizi — bağlamsal değerlendirme yapılır</li>
            </ol>
            <p className="mt-3">
              Otomatik sistem yanlış bir karar verirse{' '}
              <Link href="/iletisim" className="text-blue-600 hover:underline">iletişim formu</Link>{' '}
              aracılığıyla bize ulaşabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">İçerik kaldırma (Takedown) süreci</h2>
            <p className="mb-3">
              Hakkınızda yayınlanmış ve kurallara aykırı olduğunu düşündüğünüz bir içerik için:
            </p>
            <div className="bg-ink-50 border border-ink-200 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <span className="bg-ink-900 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p><strong>E-posta gönderin:</strong>{' '}
                  <a href="mailto:info@otrsocial.com" className="text-blue-600 hover:underline">info@otrsocial.com</a>{' '}
                  adresine &quot;İçerik Kaldırma Talebi&quot; konusuyla yazın.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="bg-ink-900 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p><strong>Belirtin:</strong> İçeriğin bağlantısı veya tarih/saati, neden kaldırılması gerektiği, varsa ek bilgi.</p>
              </div>
              <div className="flex gap-3">
                <span className="bg-ink-900 text-white text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p><strong>Yanıt süresi:</strong> İş günleri içinde en geç 5 gün içinde geri dönüş yapılır.</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-ink-500">
              Yasal zorunluluk durumunda (mahkeme kararı vb.) yetkili mercilere gerekli bilgi sağlanır.
              Detaylar için{' '}
              <Link href="/kvkk" className="text-blue-600 hover:underline">Gizlilik Politikamıza</Link>{' '}
              bakabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">Kural ihlali yaptırımları</h2>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Kurallara aykırı içerik bildirimsiz kaldırılır</span></li>
              <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Tekrarlayan ihlallerde hesap geçici olarak askıya alınır</span></li>
              <li className="flex gap-2"><span className="mt-0.5 shrink-0">•</span><span>Ağır ihlallerde (tehdit, doxxing) hesap kalıcı olarak kapatılır</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">Sorularınız mı var?</h2>
            <p>
              Kurallara ilişkin sorularınız için{' '}
              <Link href="/iletisim" className="text-blue-600 hover:underline">iletişim formumuzu</Link>{' '}
              kullanabilir veya{' '}
              <a href="mailto:info@otrsocial.com" className="text-blue-600 hover:underline">info@otrsocial.com</a>{' '}
              adresine yazabilirsiniz.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </>
  )
}
