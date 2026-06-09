import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "İş İlanları | OTR Social",
  description: "Türkiye nin en karar verici beyaz yaka kitlesine ulaşın.",
}

export default function IsIlanlariPage() {
  const stats = [
    { n: "4.2K+", l: "aktif kullanıcı" },
    { n: "200+", l: "şirket profili" },
    { n: "%100", l: "beyaz yaka kitle" },
    { n: "0", l: "aktif ilan — henüz" },
  ]
  const jobs = [
    { init: "TC", title: "Senior Product Manager", co: "TechCorp · İstanbul, Hibrit", tags: ["Ürün", "Tam zamanlı"], isNew: true, date: "2 gün önce", feat: true },
    { init: "MK", title: "Marketing Director", co: "Marka A · Ankara, Remote", tags: ["Pazarlama", "Hibrit"], isNew: false, date: "5 gün önce", feat: false },
  ]
  const filters = ["Tümü", "İstanbul", "Remote"]

  return (
    <><Navbar /><main className="bg-white min-h-screen">
      <section className="bg-[#0000FF] px-6 pt-14 pb-12 md:px-16 md:pt-20 md:pb-16">
        <span className="inline-block border border-white/40 rounded-full px-4 py-1 text-[11px] font-semibold tracking-widest text-white/80 mb-6">
          YAKINDA
        </span>
        <h1 className="text-white font-black text-4xl md:text-5xl leading-tight tracking-tight max-w-2xl mb-4">
          OTR Social&apos;da henüz kimse iş ilanı vermedi.
          <br />
          İlk siz olun.
        </h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl mb-8">
          Türkiye&apos;nin en karar verici, en sorgulayan, en zor ikna olan beyaz yaka kitlesine — tam da kariyer kararı verdikleri anda — ulaşmak isteyen markalar için.
        </p>
        <a href="/iletisim" className="inline-flex items-center gap-2 bg-white text-[#0000FF] font-black text-sm rounded-full px-7 py-3.5 hover:bg-white/90 transition-colors">
          Erken erişim için bize yazın →
        </a>
        <p className="mt-4 text-white/40 text-xs italic">Yanıt süresi: 24 saat. Spam süresi: sıfır.</p>
      </section>

      <div className="bg-black grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="px-6 py-5 border-r border-white/10 last:border-r-0">
            <p className="text-white font-black text-2xl">{s.n}</p>
            <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="px-6 py-8 md:px-16 md:py-10 max-w-5xl">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="font-black text-base text-black flex-1">Tüm İlanlar</span>
          {filters.map((f, i) => (
            <button key={f} className={`rounded-full px-4 py-1.5 text-xs font-semibold border-[1.5px] transition-colors ${i === 0 ? "bg-[#0000FF] text-white border-[#0000FF]" : "bg-white text-black border-black hover:bg-gray-50"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="bg-[#b8d3f2] rounded-xl px-5 py-4 flex items-start gap-4 mb-5">
          <span className="text-2xl mt-0.5">👀</span>
          <div>
            <p className="font-black text-[#0000FF] text-sm">Burası henüz boş. Ama uzun sürmez.</p>
            <p className="text-[#0000FF]/75 text-xs mt-1">İlanlar yakında açılıyor. Erken davranan kazanır — klişe ama bu sefer gerçek.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 opacity-30 pointer-events-none select-none">
          {jobs.map((job, i) => (
            <div key={i} className={`bg-white border-[1.5px] border-black rounded-xl p-5 flex items-start gap-4 ${job.feat ? "border-l-[5px] border-l-[#0000FF]" : ""}`}>
              <div className="w-10 h-10 rounded-lg bg-[#b8d3f2] flex items-center justify-center text-[#0000FF] font-black text-sm flex-shrink-0">
                {job.init}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-black text-sm">{job.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 mb-2">{job.co}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {job.tags.map((t) => (
                    <span key={t} className="bg-[#b8d3f2] text-[#0000FF] rounded-full px-2.5 py-0.5 text-[11px] font-semibold">{t}</span>
                  ))}
                  {job.isNew && <span className="bg-[#ed1c24] text-white rounded-full px-2.5 py-0.5 text-[11px] font-semibold">Yeni</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-gray-400 text-[11px] mb-1.5">{job.date}</p>
                <button className="border-[1.5px] border-black rounded-lg px-3 py-1 text-xs font-black text-black">İncele →</button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-[11px] mt-2">Örnek ilanlar — henüz yayında değil</p>

        <div className="bg-black rounded-xl px-6 py-7 mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white font-black text-lg leading-snug">İlanınızı vermek için<br />sıraya girin.</p>
            <p className="text-white/55 text-xs mt-1.5">4.2K beyaz yaka sizi bekliyor. Boşta değil, karar aşamasında.</p>
          </div>
          <a href="/iletisim" className="bg-[#0000FF] text-white font-black text-sm rounded-full px-6 py-3 whitespace-nowrap hover:bg-blue-700 transition-colors flex-shrink-0">
            Erken erişim →
          </a>
        </div>
      </div>
    </main><Footer /></>
  )
}
