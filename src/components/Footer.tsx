export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] text-ink-400">© 2025 Platform. Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-6">
          <a href="/hakkinda" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Hakkında</a>
          <a href="/kvkk" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Gizlilik Politikası</a>
          <a href="/kullanim-kosullari" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Kullanım Koşulları</a>
          <a href="mailto:iletisim@platform.com" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">İletişim</a>
        </div>
      </div>
    </footer>
  )
}