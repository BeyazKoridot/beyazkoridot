'use client'
import { usePathname } from 'next/navigation'
import AuthModal from './AuthModal'
import { useState } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-100 flex items-center justify-around h-16 px-2 md:hidden">
        <a href="/" className={`flex flex-col items-center gap-0.5 px-4 py-2 ${pathname === '/' ? 'text-ink-900' : 'text-ink-400'}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill={pathname === '/' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M11 2L3 8v12h5v-6h6v6h5V8L11 2z" strokeLinejoin="round"/></svg>
          <span className="text-[10px] font-medium">Ana sayfa</span>
        </a>

        <a href="/ara" className={`flex flex-col items-center gap-0.5 px-4 py-2 ${pathname === '/ara' ? 'text-ink-900' : 'text-ink-400'}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><path d="M17 17l3 3" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Ara</span>
        </a>

        <a href="/" className="flex flex-col items-center gap-0.5 px-2">
          <div className="w-12 h-12 rounded-full bg-ink-900 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2"><path d="M10 4v12M4 10h12" strokeLinecap="round"/></svg>
          </div>
        </a>

        <button className="flex flex-col items-center gap-0.5 px-4 py-2 text-ink-400">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 2a7 7 0 017 7c0 4-2 6-2 9H6c0-3-2-5-2-9a7 7 0 017-7z" strokeLinejoin="round"/><path d="M9 18a2 2 0 004 0" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Bildirim</span>
        </button>

        <a href="/profil" className={`flex flex-col items-center gap-0.5 px-4 py-2 ${pathname === '/profil' ? 'text-ink-900' : 'text-ink-400'}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="8" r="4"/><path d="M4 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </a>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}