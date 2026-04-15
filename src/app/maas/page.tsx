'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SEKTORLER = ['Teknoloji', 'Finans', 'Pazarlama', 'Danismanlik', 'Insan kaynaklari', 'E-ticaret', 'Medya', 'Hukuk', 'Diger']
const UNVANLAR = ['Stajyer', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'C-level']
const SEHIRLER = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Remote', 'Diger']

export default function MaasPage() {
  const [user, setUser] = useState(null as any)
  const [salaries, setSalaries] = useState([] as any[])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterSektor, setFilterSektor] = useState('')
  const [filterUnvan, setFilterUnvan] = useState('')
  const [filterSehir, setFilterSehir] = useState('')
  const [sektor, setSektor] = useState('')
  const [unvan, setUnvan] = useState('')
  const [sehir, setSehir] = useState('')
  const [maas, setMaas] = useState('')
  const [yilDeneyim, setYilDeneyim] = useState('')
  const [sirketAdi, setSirketAdi] = useState('')
  const [onay, setOnay] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.from('salary_data').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setSalaries(data || [])
      setLoading(false)
    })
  }, [])

  const handleSubmit = async () => {
    if (!sektor || !unvan || !maas) { setError('Sektor, unvan ve maas zorunlu'); return }
    if (!onay) { setError('Lutfen onay kutusunu isaretleyin'); return }
    setSubmitting(true)
    const { error: err } = await supabase.from('salary_data').insert({
      user_id: user?.id ?? null,
      sektor, unvan, sehir,
      maas: parseInt(maas),
      yil_deneyim: yilDeneyim ? parseInt(yilDeneyim) : null,
      sirket_adi: sirketAdi || null,
      is_anon: true,
    })
    if (!err) {
      setSuccess(true)
      setShowForm(false)
      setSektor(''); setUnvan(''); setSehir(''); setMaas(''); setYilDeneyim(''); setSirketAdi(''); setOnay(false)
      supabase.from('salary_data').select('*').order('created_at', { ascending: false }).then(({ data }) => setSalaries(data || []))
      setTimeout(() => setSuccess(false), 3000)
    }
    setSubmitting(false)
  }

  const filtered = salaries.filter(s =>
    (!filterSektor || s.sektor === filterSektor) &&
    (!filterUnvan || s.unvan === filterUnvan) &&
    (!filterSehir || s.sehir === filterSehir)
  )

  const avgMaas = filtered.length > 0 ? Math.round(filtered.reduce((a, s) => a + s.maas, 0) / filtered.length) : 0
  const minMaas = filtered.length > 0 ? Math.min(...filtered.map(s => s.maas)) : 0
  const maxMaas = filtered.length > 0 ? Math.max(...filtered.map(s => s.maas)) : 0
  const yeterliVeri = filtered.length >= 3

  if (!user) return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-[20px] font-semibold text-ink-900 mb-3">Maaş Rehberi</h1>
        <p className="text-[14px] text-ink-400 mb-6">Bu sayfayı görmek için üye olman gerekiyor.</p>
        <a href="/" className="text-[13px] font-medium text-white px-6 py-2.5 rounded-lg bg-ink-900 hover:bg-ink-700 transition-colors">Üye ol / Giriş yap</a>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-ink-900">Maaş Rehberi</h1>
            <p className="text-[13px] text-ink-400 mt-0.5">Çalışanların gönüllü olarak paylaştığı maaş verileri</p>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="text-[13px] font-medium text-white px-4 py-2 rounded-lg bg-ink-900 hover:bg-ink-700 transition-colors">
            + Maaşımı ekle
          </button>
        </div>

        {success && <div className="mb-4 px-4 py-2.5 bg-green-50 text-green-700 text-[13px] rounded-lg">Maaş veriniz eklendi, teşekkürler!</div>}

        {showForm && (
          <div className="bg-white rounded-xl border border-ink-200 p-5 mb-6">
            <h2 className="text-[15px] font-medium text-ink-900 mb-4">Maaş bilgisi ekle</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <select value={sektor} onChange={e => setSektor(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none">
                <option value="">Sektör *</option>
                {SEKTORLER.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={unvan} onChange={e => setUnvan(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none">
                <option value="">Ünvan *</option>
                {UNVANLAR.map(u => <option key={u}>{u}</option>)}
              </select>
              <select value={sehir} onChange={e => setSehir(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none">
                <option value="">Şehir</option>
                {SEHIRLER.map(s => <option key={s}>{s}</option>)}
              </select>
              <input value={yilDeneyim} onChange={e => setYilDeneyim(e.target.value)} type="number" placeholder="Yıl deneyim" className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none" />
              <input value={maas} onChange={e => setMaas(e.target.value)} type="number" placeholder="Aylık net maaş (TL) *" className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none col-span-2" />
              <input value={sirketAdi} onChange={e => setSirketAdi(e.target.value)} placeholder="Şirket adı (opsiyonel)" className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none col-span-2" />
            </div>
            <label className="flex items-start gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={onay} onChange={e => setOnay(e.target.checked)} className="mt-0.5 shrink-0" />
              <span className="text-[11px] text-ink-500 leading-relaxed">Bu maaş bilgisini gönüllü olarak paylaşıyorum. Platformun bu veriyi doğrulama yükümlülüğü yoktur; sorumluluk bana aittir.</span>
            </label>
            {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="text-[12px] text-ink-400 px-3 py-1.5">İptal</button>
              <button onClick={handleSubmit} disabled={submitting} className="text-[12px] font-medium text-white px-4 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-700 disabled:opacity-50">
                {submitting ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <select value={filterSektor} onChange={e => setFilterSektor(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none bg-white">
            <option value="">Tüm sektörler</option>
            {SEKTORLER.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterUnvan} onChange={e => setFilterUnvan(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none bg-white">
            <option value="">Tüm ünvanlar</option>
            {UNVANLAR.map(u => <option key={u}>{u}</option>)}
          </select>
          <select value={filterSehir} onChange={e => setFilterSehir(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none bg-white">
            <option value="">Tüm şehirler</option>
            {SEHIRLER.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {filtered.length > 0 && (
          <div className="bg-white rounded-xl border border-ink-100 p-4 mb-4 flex items-center gap-8">
            <div>
              <p className="text-[11px] text-ink-400 mb-0.5">Ortalama</p>
              {yeterliVeri ? (
                <p className="text-[20px] font-semibold text-ink-900">{avgMaas.toLocaleString('tr-TR')} TL</p>
              ) : (
                <p className="text-[13px] text-ink-400">Yeterli veri yok</p>
              )}
            </div>
            <div>
              <p className="text-[11px] text-ink-400 mb-0.5">Aralık</p>
              {yeterliVeri ? (
                <p className="text-[14px] font-medium text-ink-700">{minMaas.toLocaleString('tr-TR')} – {maxMaas.toLocaleString('tr-TR')} TL</p>
              ) : (
                <p className="text-[13px] text-ink-400">En az 3 veri gerekli</p>
              )}
            </div>
            <div>
              <p className="text-[11px] text-ink-400 mb-0.5">Paylaşım sayısı</p>
              <p className="text-[20px] font-semibold text-ink-900">{filtered.length}</p>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-ink-400 text-[13px] py-12">Yükleniyor...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-ink-100">
            <p className="text-[13px] text-ink-400">Henüz veri yok. İlk maaş verisini sen ekle!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-ink-50 border-b border-ink-100">
                <tr>
                  <th className="text-left text-[11px] text-ink-500 font-medium px-4 py-2.5">Sektör / Ünvan</th>
                  <th className="text-left text-[11px] text-ink-500 font-medium px-4 py-2.5">Şehir</th>
                  <th className="text-left text-[11px] text-ink-500 font-medium px-4 py-2.5">Deneyim</th>
                  <th className="text-right text-[11px] text-ink-500 font-medium px-4 py-2.5">Maaş</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-ink-50 hover:bg-ink-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-ink-900">{s.unvan}</p>
                      <p className="text-[11px] text-ink-400">{s.sektor}{s.sirket_adi ? ' — ' + s.sirket_adi : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-600">{s.sehir || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-ink-600">{s.yil_deneyim ? s.yil_deneyim + ' yıl' : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      {yeterliVeri ? (
                        <span className="text-[14px] font-semibold text-ink-900">{s.maas.toLocaleString('tr-TR')} TL</span>
                      ) : (
                        <span className="text-[12px] text-ink-400">Gizli</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!yeterliVeri && (
              <p className="text-center text-[11px] text-ink-400 py-3 border-t border-ink-50">Maaş verileri 3 paylaşımdan sonra görünür hale gelir.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
