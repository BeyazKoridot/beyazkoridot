import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'OTR Social — Türkiye\'nin anonim beyaz yaka platformu',
  description: 'Off the record. Maaş, kariyer, çalışma kültürü — özgeçmişte yazmadığın her şey için.',
  keywords: ['beyaz yaka', 'maaş paylaşımı', 'kariyer', 'anonim platform', 'çalışma kültürü', 'burnout', 'türkiye iş dünyası'],
  authors: [{ name: 'OTR Social' }],
  openGraph: {
    title: 'OTR Social — Türkiye\'nin anonim beyaz yaka platformu',
    description: 'Maaş, kariyer, çalışma kültürü — söyleyemediklerini burada söyle.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'OTR Social',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTR Social — Türkiye\'nin anonim beyaz yaka platformu',
    description: 'Maaş, kariyer, çalışma kültürü — söyleyemediklerini burada söyle.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OTR Social',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans bg-ink-50 text-ink-900 pb-16 md:pb-0`}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}