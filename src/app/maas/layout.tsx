import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maaş Rehberi — Anonim Maaş Verileri | OTR Social',
  description: 'Türkiye\'de yazılım, finans, pazarlama ve diğer sektörlerde gerçek çalışanların anonim maaş verileri. Seniority ve şehir bazlı karşılaştırma.',
  openGraph: {
    title: 'Maaş Rehberi | OTR Social',
    description: 'Anonim çalışan maaş verileri — sektör, unvan ve şehir bazlı karşılaştırma.',
    url: 'https://otrsocial.com/maas',
  },
  alternates: {
    canonical: 'https://otrsocial.com/maas',
  },
}

export default function MaasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
