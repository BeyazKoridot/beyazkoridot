'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthModal from './AuthModal'
import type { User } from '@supabase/supabase-js'

type Props = { onFilterChange?: (filter: string) => void }

export default function Navbar({ onFilterChange }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { label: 'Ana Akış', filter: 'Tümü' },
    { label: 'Maaş Rehberi', filter: 'Maaş' },
    { label: 'Kariyer', filter: 'Kariyer' },
    { label: 'Anketler', filter: 'Anket' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-ink-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">OTR</span>
            </div>
            <span className="font-semibold text-ink-900 text-[15px]">Platform</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.label}
                onClick={() => onFilterChange?.(item.filter)}
                className="text-[13px] text-ink-600 hover:text-ink-900 px-3 py-1.5 rounded-md hover:bg-ink-50 transition-colors">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <a href="/profil" className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-ink-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-ink-900 flex items-center justify-center">
                    <span className="text-white text-[11px] font-medium">{user.email?.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="hidden md:block text-[13px] text-ink-600">Profil</span>
                </a>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setAuthMode('login'); setShowAuth(true) }}
                  className="hidden md:block text-[12px] text-ink-600 px-3 py-1.5 rounded-md border border-ink-200 hover:bg-ink-50 transition-colors">
                  Giriş yap
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setShowAuth(true) }}
                  className="text-[12px] text-white px-4 py-1.5 rounded-md bg-ink-900 hover:bg-ink-700 font-medium transition-colors">
                  Üye ol
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} />}
    </>
  )
}