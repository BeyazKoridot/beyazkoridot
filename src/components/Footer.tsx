export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] text-ink-400">© 2026 OTR Social. Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-6">
          <a href="/hakkinda" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Hakkında</a>
          <a href="/kvkk" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Gizlilik Politikası</a>
          <a href="/kullanim-kosullari" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Kullanım Koşulları</a>
          <a href="/topluluk-kurallari" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">Topluluk Kuralları</a>
          <a href="/iletisim" className="text-[12px] text-ink-400 hover:text-ink-700 transition-colors">İletişim</a>
          <div className="w-px h-4 bg-ink-200"></div>
          <div className="flex items-center gap-2.5">
            <a href="https://instagram.com/otrsocial" target="_blank" className="flex items-center justify-center w-7 h-7 rounded-md border border-ink-200 text-ink-400 hover:text-ink-700 hover:border-ink-400 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://linkedin.com/company/otrsocial" target="_blank" className="flex items-center justify-center w-7 h-7 rounded-md border border-ink-200 text-ink-400 hover:text-ink-700 hover:border-ink-400 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}