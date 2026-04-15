'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import AuthModal from './AuthModal'
import type { User } from '@supabase/supabase-js'

type Props = { onFilterChange?: (filter: string) => void }

export default function Navbar({ onFilterChange }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchNotifications(data.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchNotifications(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    setNotifications(data ?? [])
    setUnreadCount((data ?? []).filter((n: any) => !n.is_read).length)
  }

  const markAllRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    setUnreadCount(0)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

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
              <button
                key={item.label}
                onClick={() => onFilterChange?.(item.filter)}
                className="text-[13px] text-ink-600 hover:text-ink-900 px-3 py-1.5 rounded-md hover:bg-ink-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setShowNotifications(v => !v); markAllRead() }}
                    className="relative p-2 rounded-md hover:bg-ink-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-600">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-ink-100 shadow-lg z-50">
                      <div className="p-3 border-b border-ink-50">
                        <span className="text-[13px] font-medium text-ink-800">Bildirimler</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-[12px] text-ink-400 text-center py-6">Henüz bildirim yok</p>
                        ) : notifications.map((n: any) => (
                          <a
                            key={n.id}
                            href={n.related_post_id ? `/post/${n.related_post_id}` : '#'}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-ink-50 transition-colors border-b border-ink-50 ${!n.is_read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="w-7 h-7 rounded-full bg-ink-100 flex items-center justify-center shrink-0 mt-0.5">
                              {n.type === 'like' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="red" stroke="none">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-[12px] text-ink-700">{n.message}</p>
                              <p className="text-[11px] text-ink-400 mt-0.5">{new Date(n.created_at).toLocaleDateString('tr-TR')}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                  className="hidden md:block text-[12px] text-ink-600 px-3 py-1.5 rounded-md border border-ink-200 hover:bg-ink-50 transition-colors"
                >
                  Giriş yap
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setShowAuth(true) }}
                  className="text-[12px] text-white px-4 py-1.5 rounded-md bg-ink-900 hover:bg-ink-700 font-medium transition-colors"
                >
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
