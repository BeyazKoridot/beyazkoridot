import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'XRB54ocIwzAl9Xhlj2yqtQBFJX3V_spiymPH0yZpMSI',
  },
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
        <meta name="google-site-verification" content="XRB54ocIwzAl9Xhlj2yqtQBFJX3V_spiymPH0yZpMSI" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0Y0L4TTQG6"></script>
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0Y0L4TTQG6');`}} />
      </head>
      <body className={`${dmSans.variable} font-sans bg-[#f0f6ff] text-[#0a0a0a] pb-16 md:pb-0`}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}