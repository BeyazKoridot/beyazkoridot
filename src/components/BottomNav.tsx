'use client'
import { usePathname } from 'next/navigation'
import AuthModal from './AuthModal'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function BottomNav() {
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifRef = useRef(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) fetchNotifications(data.user.id)
    })
  }, [])

  const fetchNotifications = async (userId) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    setNotifications(data ?? [])
    const unread = (data ?? []).filter(n => !n.is_read)
    setUnreadCount(unread.length)
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
            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl border border-ink-100 shadow-lg z-50">
              <div className="p-3 border-b border-ink-50">
                <span className="text-[13px] font-medium text-ink-800">Bildirimler</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-[12px] text-ink-400 text-center py-6">Henüz bildirim yok</p>
                ) : notifications.map((n) => (
                  
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

        <a href="/profil" className={`flex flex-col items-center gap-0.5 px-4 py-2 ${pathname === '/profil' ? 'text-ink-900' : 'text-ink-400'}`}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="8" r="4"/><path d="M4 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </a>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
