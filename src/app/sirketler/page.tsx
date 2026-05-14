import SirketlerClient from './SirketlerClient'

export const metadata = {
  title: 'Şirket Deneyimleri & Kültür Yorumları | OTR Social',
  description: 'Türkiye\'deki şirketlerde çalışan deneyimleri, iş kültürü değerlendirmeleri ve maaş bilgileri. Anonim çalışan yorumlarını keşfet.',
}

export default function SirketlerPage() {
  return <SirketlerClient />
}
