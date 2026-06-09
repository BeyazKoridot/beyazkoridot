'use client'
import { usePathname } from 'next/navigation'
import AuthModal from './AuthModal'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function BottomNav() {
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([] as any[])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifRef = useRef(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchNotifications(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    const items = (data ?? []) as any[]
    setNotifications(items)
    setUnreadCount(items.filter((n: any) => !n.is_read).length)
  }

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    setUnreadCount(0)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e0e8f5] flex items-center justify-around h-16 px-2 md:hidden">
        <button onClick={() => setShowMenu(v => !v)} className="flex flex-col items-center gap-0.5 px-4 py-2 text-ink-400">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h16M3 11h16M3 16h16" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Menü</span>
        </button>
        <a href="/ara" className={`flex flex-col items-center gap-0.5 px-4 py-2 ${pathname === '/ara' ? 'text-[#0a0a0a]' : 'text-ink-400'}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><path d="M17 17l3 3" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Ara</span>
        </a>
        <a href="/" className="flex flex-col items-center gap-0.5 px-2">
          <div className="w-12 h-12 rounded-full bg-[#0000FF] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2"><path d="M10 4v12M4 10h12" strokeLinecap="round"/></svg>
          </div>
        </a>
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(v => !v); markAllRead() }}
            className="flex flex-col items-center gap-0.5 px-4 py-2 text-ink-400 relative"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 2a7 7 0 017 7c0 4-2 6-2 9H6c0-3-2-5-2-9a7 7 0 017-7z" strokeLinejoin="round"/><path d="M9 18a2 2 0 004 0" strokeLinecap="round"/></svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="text-[10px] font-medium">Bildirim</span>
          </button>
          {showNotifications && (
            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl border border-[#e0e8f5] shadow-lg z-50">
              <div className="p-3 border-b border-[#f0f6ff]">
                <span className="text-[13px] font-medium text-ink-800">Bildirimler</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-[12px] text-ink-400 text-center py-6">Henüz bildirim yok</p>
                ) : notifications.map((n) => (
                  <a
                    key={n.id}
                    href={n.related_post_id ? `/post/${n.related_post_id}` : '#'}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-[#f0f6ff] transition-colors border-b border-[#f0f6ff] ${!n.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-[12px] text-ink-700">{n.message}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <a href="/profil" className={`flex flex-col items-center gap-0.5 px-4 py-2 ${pathname === '/profil' ? 'text-[#0a0a0a]' : 'text-ink-400'}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="8" r="4"/><path d="M4 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </a>
      </nav>
      {showMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMenu(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-[#e0e8f5]">
              <span className="font-black text-[#0000FF] text-lg">OTR Social</span>
              <button onClick={() => setShowMenu(false)}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l14 14M18 4L4 18" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex flex-col py-4">
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/maas', label: 'Maaş Rehberi' },
                { href: '/is-ilanlari', label: 'İş İlanları' },
                { href: '/sirketler', label: 'Şirket Deneyimleri' },
                { href: '/ara', label: 'Ara' },
                { href: '/profil', label: 'Profil' },
              ].map((item) => (
                
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMenu(false)}
                  className={`px-6 py-3.5 text-sm font-semibold border-b border-[#f0f6ff] ${pathname === item.href ? 'text-[#0000FF]' : 'text-[#0a0a0a]'}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
