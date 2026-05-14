import MaasClient from './MaasClient'

export const metadata = {
  title: 'Maaş Rehberi — Sektöre Göre Gerçek Maaşlar | OTR Social',
  description: 'Türkiye\'de teknoloji, finans, pazarlama ve diğer sektörlerde anonim maaş verileri. Seniority bazlı maaş aralıkları, medyan ve ortalama maaş bilgileri.',
  openGraph: {
    title: 'Maaş Rehberi — Sektöre Göre Gerçek Maaşlar | OTR Social',
    description: 'Türkiye\'de yazılım, finans ve diğer sektörlerde anonim maaş verileri. Gerçek çalışanların paylaştığı maaş bilgileri.',
    type: 'website',
  },
}

export default function MaasPage() {
  return <MaasClient />
}
