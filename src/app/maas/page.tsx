'use client'
import { useState, useEffect, useRef } from 'react'
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
  const [filterSehir, setFilterSehir] = useState('')
  const [filterUnvan, setFilterUnvan] = useState('')
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
  const [chartReady, setChartReady] = useState(false)
  const barRef = useRef(null as any)
  const hbarRef = useRef(null as any)
  const barChart = useRef(null as any)
  const hbarChart = useRef(null as any)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.from('salary_data').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setSalaries(data || [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if ((window as any).Chart) { setChartReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
    script.onload = () => setChartReady(true)
    document.head.appendChild(script)
  }, [])

  const filtered = salaries.filter(s =>
    (!filterSektor || s.sektor === filterSektor) &&
    (!filterSehir || s.sehir === filterSehir) &&
    (!filterUnvan || s.unvan === filterUnvan)
  )

  const yeterliVeri = filtered.length >= 3
  const avgMaas = filtered.length > 0 ? Math.round(filtered.reduce((a, s) => a + s.maas, 0) / filtered.length) : 0
  const minMaas = filtered.length > 0 ? Math.min(...filtered.map(s => s.maas)) : 0
  const maxMaas = filtered.length > 0 ? Math.max(...filtered.map(s => s.maas)) : 0
  const medyanMaas = filtered.length > 0 ? [...filtered].sort((a, b) => a.maas - b.maas)[Math.floor(filtered.length / 2)].maas : 0

  const unvanSirasi = ['Stajyer', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'C-level']
  const unvanData = unvanSirasi.map(u => {
    const group = filtered.filter(s => s.unvan === u)
    return group.length > 0 ? Math.round(group.reduce((a, s) => a + s.maas, 0) / group.length) : 0
  })

  const sektorLabels = SEKTORLER.filter((_, i) => {
    const group = filtered.filter(s => s.sektor === SEKTORLER[i])
    return group.length > 0
  })
  const sektorData = sektorLabels.map(sk => {
    const group = filtered.filter(s => s.sektor === sk)
    return Math.round(group.reduce((a, s) => a + s.maas, 0) / group.length)
  })

  useEffect(() => {
    if (!chartReady || loading || !yeterliVeri) return
    const Chart = (window as any).Chart
    const textColor = 'rgba(0,0,0,0.5)'
    const gridColor = 'rgba(0,0,0,0.06)'
    const barColor = '#3a3a3a'

    setTimeout(() => {
      if (barChart.current) { barChart.current.destroy(); barChart.current = null }
      if (hbarChart.current) { hbarChart.current.destroy(); hbarChart.current = null }

      if (barRef.current) {
        barChart.current = new Chart(barRef.current, {
          type: 'bar',
          data: {
            labels: unvanSirasi,
            datasets: [{ data: unvanData, backgroundColor: barColor, borderRadius: 4 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { color: textColor, font: { size: 11 }, autoSkip: false, maxRotation: 0 },
                grid: { display: false }, border: { display: false }
              },
              y: {
                ticks: { color: textColor, font: { size: 11 }, callback: (v: number) => v === 0 ? '' : (v / 1000) + 'K TL' },
                grid: { color: gridColor }, border: { display: false }
              }
            }
          }
        })
      }

      if (hbarRef.current && sektorLabels.length > 0) {
        hbarChart.current = new Chart(hbarRef.current, {
          type: 'bar',
          data: {
            labels: sektorLabels,
            datasets: [{ data: sektorData, backgroundColor: barColor, borderRadius: 4 }]
          },
          options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { color: textColor, font: { size: 11 }, callback: (v: number) => v === 0 ? '' : (v / 1000) + 'K' },
                grid: { color: gridColor }, border: { display: false }
              },
              y: {
                ticks: { color: textColor, font: { size: 12 } },
                grid: { display: false }, border: { display: false }
              }
            }
          }
        })
      }
    }, 100)
  }, [chartReady, loading, filtered.length, filterSektor, filterSehir, filterUnvan])

  const handleSubmit = async () => {
    if (!sektor || !unvan || !maas) { setError('Sektör, ünvan ve maaş zorunlu'); return }
    if (!onay) { setError('Lütfen onay kutusunu işaretleyin'); return }
    setSubmitting(true)
    const { error: err } = await supabase.from('salary_data').insert({
      user_id: user?.id ?? null, sektor, unvan, sehir,
      maas: parseInt(maas),
      yil_deneyim: yilDeneyim ? parseInt(yilDeneyim) : null,
      sirket_adi: sirketAdi || null,
      is_anon: true,
    })
    if (!err) {
      setSuccess(true); setShowForm(false)
      setSektor(''); setUnvan(''); setSehir(''); setMaas(''); setYilDeneyim(''); setSirketAdi(''); setOnay(false)
      supabase.from('salary_data').select('*').order('created_at', { ascending: false }).then(({ data }) => setSalaries(data || []))
      setTimeout(() => setSuccess(false), 3000)
    }
    setSubmitting(false)
  }

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
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[22px] font-semibold text-ink-900">Maaş Rehberi</h1>
            <p className="text-[13px] text-ink-400 mt-0.5">Çalışanların gönüllü olarak paylaştığı maaş verileri</p>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="text-[13px] font-medium text-white px-4 py-2 rounded-lg bg-ink-900 hover:bg-ink-700 transition-colors">+ Maaşımı ekle</button>
        </div>

        <div className="mb-6 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Bu sayfadaki veriler kullanıcılar tarafından gönüllü olarak paylaşılmıştır. Platform, verilerin doğruluğunu garanti etmez ve herhangi bir sorumluluk kabul etmez. Veriler yalnızca genel bir fikir edinmek amacıyla sunulmaktadır.
          </p>
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

        <div className="flex flex-wrap gap-2 mb-6">
          <select value={filterSektor} onChange={e => setFilterSektor(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none bg-white">
            <option value="">Tüm sektörler</option>
            {SEKTORLER.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterSehir} onChange={e => setFilterSehir(e.target.value)} className="text-[12px] border border-ink-200 rounded-lg px-2.5 py-2 outline-none bg-white">
            <option value="">Tüm şehirler</option>
            {SEHIRLER.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex gap-1.5 flex-wrap">
            {['', ...UNVANLAR].map(u => (
              <button key={u} onClick={() => setFilterUnvan(u)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${filterUnvan === u ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-500 border-ink-200 hover:border-ink-400'}`}>
                {u || 'Tümü'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Ortalama maaş', value: yeterliVeri ? avgMaas.toLocaleString('tr-TR') + ' TL' : '—' },
            { label: 'Aralık', value: yeterliVeri ? minMaas.toLocaleString('tr-TR') + ' – ' + maxMaas.toLocaleString('tr-TR') + ' TL' : '—' },
            { label: 'Medyan', value: yeterliVeri ? medyanMaas.toLocaleString('tr-TR') + ' TL' : '—' },
            { label: 'Veri sayısı', value: filtered.length.toString() },
          ].map(m => (
            <div key={m.label} className="bg-ink-50 rounded-lg p-3">
              <p className="text-[11px] text-ink-400 mb-1">{m.label}</p>
              <p className="text-[16px] font-semibold text-ink-900">{m.value}</p>
            </div>
          ))}
        </div>

        {!yeterliVeri ? (
          <div className="text-center py-16 bg-white rounded-xl border border-ink-100">
            <p className="text-[14px] font-medium text-ink-700 mb-1">Grafik için yeterli veri yok</p>
            <p className="text-[12px] text-ink-400">En az 3 maaş verisi paylaşıldığında grafikler görünür hale gelir.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-ink-100 p-5 mb-4">
              <p className="text-[12px] font-medium text-ink-500 mb-4">Seniority bazlı ortalama maaş</p>
              <div style={{ position: 'relative', height: '240px' }}>
                <canvas ref={barRef} role="img" aria-label="Seniority bazlı ortalama maaş grafiği"></canvas>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-ink-100 p-5 mb-6">
              <p className="text-[12px] font-medium text-ink-500 mb-4">Sektör karşılaştırması</p>
              <div style={{ position: 'relative', height: `${Math.max(sektorLabels.length * 44 + 40, 160)}px` }}>
                <canvas ref={hbarRef} role="img" aria-label="Sektör bazlı ortalama maaş karşılaştırması"></canvas>
              </div>
            </div>
          </>
        )}

        <div className="px-4 py-3 bg-ink-50 rounded-lg border border-ink-100">
          <p className="text-[11px] text-ink-400 leading-relaxed">
            <span className="font-medium text-ink-500">Yasal uyarı:</span> Bu sayfadaki maaş verileri, kullanıcıların gönüllü ve anonim olarak paylaştığı bilgilerden oluşmaktadır. Beyaz Koridot, söz konusu verilerin doğruluğunu, güncelliğini veya eksiksizliğini taahhüt etmez; yalnızca bilgilendirme amacıyla sunar. Veriler herhangi bir işveren veya çalışan hakkında bağlayıcı bir beyan niteliği taşımaz. Kullanım Koşulları ve Gizlilik Politikamız kapsamında değerlendirilir.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
