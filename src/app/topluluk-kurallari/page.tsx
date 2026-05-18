import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Topluluk Kuralları | Off The Record Social',
  description: 'OTR Social topluluk kuralları, içerik politikası ve içerik kaldırma süreci.',
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
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">Neden Bu Kurallar?</h2>
            <p>OTR Social, Türkiye'nin beyaz yaka çalışanlarının dürüst iş deneyimlerini paylaşabileceği bir platform. Dürüstlük değerimizi korumak için bazı sınırlar koyuyoruz. Amacımız sansür değil, güvenli bir alan yaratmak.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">✅ İzin Verilen İçerikler</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>İş deneyimi ve mülakat deneyimi paylaşımı (şirket ismi dahil)</li>
              <li>Maaş ve yan haklar bilgisi</li>
              <li>Ayrımcı işveren davranışlarının anlatımı (hamilelik sorusu, medeni durum sorusu vb.)</li>
              <li>Şirket veya sektör eleştirisi — yapıcı ya da değil</li>
              <li>Burnout, stres, tükenmişlik paylaşımı</li>
              <li>Kariyer tavsiyeleri ve deneyimler</li>
              <li>Hayal kırıklığı ve öfke ifadesi (hakaret olmadan)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">🚫 Yasaklı İçerikler</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>İftira:</strong> Gerçek kişiye yönelik isimli ve asılsız suçlama</li>
              <li><strong>Tehdit:</strong> Kişiye veya kuruma yönelik açık tehdit ifadeleri</li>
              <li><strong>Hakaret:</strong> Küfür, argo veya aşağılayıcı ifade</li>
              <li><strong>Doxxing:</strong> TC kimlik, telefon, adres gibi kişisel bilgi paylaşımı</li>
              <li><strong>Nefret söylemi:</strong> Irk, din, cinsiyet, cinsel yönelim bazlı ayrımcı ifade</li>
              <li><strong>Spam:</strong> Ticari reklam veya tekrarlı aynı içerik</li>
              <li><strong>Yanıltma:</strong> Bilerek yanlış bilgi yayma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">🤖 Otomatik Moderasyon</h2>
            <p className="mb-3">Her gönderi yayınlanmadan önce otomatik olarak incelenir:</p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Yasaklı kelime filtresi anlık çalışır</li>
              <li>Yapay zeka ile içerik analizi yapılır</li>
              <li>Kural ihlali tespit edilirse içerik yayınlanmaz, sebep gösterilir</li>
            </ol>
            <p className="mt-3 text-ink-500 text-[13px]">Otomatik sistem yanılabilir. Hatalı redler için iletişime geç.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">📩 İçerik Kaldırma Talebi</h2>
            <p className="mb-3">Platformda sana ait veya seni ilgilendiren hatalı bir içerik görürsen kaldırılmasını talep edebilirsin.</p>
            <div className="bg-ink-50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-ink-900">Nasıl talep edilir?</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-[13px]">
                <li><strong>iletisim@otrsocial.com</strong> adresine e-posta gönder</li>
                <li>Konu: <code className="bg-white px-1.5 py-0.5 rounded text-[12px]">İçerik Kaldırma Talebi</code></li>
                <li>İçeriğin URL'ini veya başlığını belirt</li>
                <li>Kaldırma gerekçeni açıkla (iftira, kişisel bilgi, vb.)</li>
              </ol>
            </div>
            <p className="mt-3 text-ink-500 text-[13px]">Talepler <strong>5 iş günü</strong> içinde değerlendirilir. Acil durumlarda (tehdit, doxxing) aynı gün işlem yapılır.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">⚖️ Yaptırımlar</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>İlk ihlal: içerik kaldırılır, uyarı gönderilir</li>
              <li>Tekrarlı ihlal: hesap askıya alınır</li>
              <li>Ağır ihlal (tehdit, doxxing): hesap kalıcı olarak kapatılır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">📬 İletişim</h2>
            <p>Sorular ve talepler için: <a href="mailto:iletisim@otrsocial.com" className="text-ink-900 underline underline-offset-2">iletisim@otrsocial.com</a></p>
          </section>

        </div>
      </div>
      <Footer />
    </>
  )
}
