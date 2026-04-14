import Navbar from '@/components/Navbar'

export default function KVKKPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-[28px] font-semibold text-ink-900 mb-2">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
        <p className="text-[13px] text-ink-400 mb-8">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

        <div className="space-y-8 text-[14px] text-ink-700 leading-relaxed">

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">1. Veri Sorumlusu</h2>
            <p>Bu platform ("Platform"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla hareket etmektedir. Platformun işletmecisi, kullanıcıların kişisel verilerini bu metin kapsamında işlemektedir.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">2. Toplanan Veriler</h2>
            <p className="mb-2">Platform üzerinden aşağıdaki veriler toplanabilmektedir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>E-posta adresi (kayıt olunması halinde)</li>
              <li>IP adresi ve cihaz bilgileri</li>
              <li>Kullanıcının paylaştığı içerikler</li>
              <li>Sektör, unvan seviyesi, şirket büyüklüğü (kullanıcının beyan etmesi halinde)</li>
              <li>Platform kullanım davranışları (sayfa görüntüleme, tıklama verileri)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">3. Anonim Paylaşım</h2>
            <p>Kullanıcılar içeriklerini anonim olarak paylaşmayı tercih ettiğinde, paylaşım diğer kullanıcılara anonim görünür. Ancak teknik altyapı gereği sistem tarafında kullanıcı kimliği ile içerik arasında ilişki bulunabilir. Bu bilgi hiçbir koşulda üçüncü şahıslarla paylaşılmaz.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">4. Verilerin Kullanım Amacı</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Platform hizmetlerinin sunulması ve geliştirilmesi</li>
              <li>Kullanıcı deneyiminin iyileştirilmesi</li>
              <li>İçerik moderasyonu ve güvenlik</li>
              <li>Anonim ve toplu istatistiksel analizler</li>
              <li>Reklam hedefleme (kişisel kimlik açıklanmaksızın segment bazlı)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">5. Verilerin Paylaşımı</h2>
            <p>Kişisel verileriniz;</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Yasal zorunluluk olmaksızın üçüncü şahıslarla paylaşılmaz</li>
              <li>Reklam verenlerle yalnızca anonim, segmente dayalı biçimde paylaşılabilir</li>
              <li>Hizmet sağlayıcılarla (hosting, analitik) gizlilik sözleşmesi kapsamında paylaşılır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">6. Haklarınız</h2>
            <p className="mb-2">KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verilere ilişkin bilgi talep etme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              <li>İşlemenin kısıtlanmasını talep etme</li>
              <li>Veri taşınabilirliği talep etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-inkik-900 mb-3">7. Çerezler</h2>
            <p>Platform, oturum yönetimi ve analitik amaçlarıyla çerez kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda platformun bazı özellikleri çalışmayabilir.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-ink-900 mb-3">8. İletişim</h2>
            <p>KVKK kapsamındaki talepleriniz için platformun iletişim kanallarını kullanabilirsiniz. Talepler 30 gün içinde yanıtlanır.</p>
          </section>

        </div>
      </div>
    </>
  )
}
