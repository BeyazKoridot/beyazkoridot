export type Post = {
  id: string
  author: string | null
  isAnon: boolean
  sector: string
  level: string
  timeAgo: string
  title: string
  excerpt: string
  tag: string
  tagColor: string
  votes: number
  comments: number
  type: 'post' | 'poll'
  pollOptions?: { label: string; pct: number }[]
}

export const POSTS: Post[] = [
  { id: '1', author: null, isAnon: true, sector: 'Teknoloji', level: 'Senior Engineer', timeAgo: '14dk önce', title: 'Büyük şirketlerde "çevik metodoloji" artık sadece toplantı üretme makinesi oldu', excerpt: '2 sprint planning, 5 standup, 3 retrospektif… Ama bir türlü ne zaman kod yazacağız?', tag: 'Çalışma kültürü', tagColor: 'brand', votes: 184, comments: 37, type: 'post' },
  { id: '2', author: 'Deniz K.', isAnon: false, sector: 'Finans', level: 'Orta düzey yönetici', timeAgo: '2sa önce', title: 'İstanbul\'da product manager maaşları gerçekten ne kadar?', excerpt: 'PM5 seviyesi, 8 yıl deneyim. Net ₺120–135K arası görüyorum ama Avrupa kökenli şirketlerde durum çok farklı.', tag: 'Maaş', tagColor: 'teal', votes: 312, comments: 89, type: 'post' },
  { id: '3', author: null, isAnon: true, sector: 'Pazarlama', level: 'Mid-level', timeAgo: '1g önce', title: 'Performans görüşmesinde "beklentilerin altında" dediler — 2 ay önce terfi vermişlerdi', excerpt: 'PIP mi geliyor, yoksa bütçe kesintisi için bahane mi üretiliyor?', tag: 'Kariyer sorunu', tagColor: 'coral', votes: 97, comments: 54, type: 'post' },
  { id: '4', author: 'Mert A.', isAnon: false, sector: 'Danışmanlık', level: 'Manager', timeAgo: '3sa önce', title: 'Big 4\'ten startup\'a geçiş: 6 ay sonra pişman oldum mu?', excerpt: 'Kısaca: hayır. Maaş düştü ama öğrendiklerim inanılmaz.', tag: 'Kariyer değişikliği', tagColor: 'amber', votes: 241, comments: 63, type: 'post' },
  { id: '5', author: null, isAnon: true, sector: 'Tümü', level: '', timeAgo: '5sa önce', title: 'Şirketiniz hybrid/remote politikasını değiştirdi mi?', excerpt: '', tag: 'Anket', tagColor: 'purple', votes: 0, comments: 23, type: 'poll', pollOptions: [{ label: 'Evet, daha az remote', pct: 41 }, { label: 'Aynı kaldı', pct: 29 }, { label: 'Tam ofise döndük', pct: 19 }, { label: 'Tam remote olduk', pct: 11 }] },
]

export const TRENDING = [{ tag: '#MaaşŞeffaflığı', count: '2.1K' }, { tag: '#YazılımKariyer', count: '843' }, { tag: '#PerfGörüşmesi', count: '671' }, { tag: '#RemoteVsOfis', count: '512' }, { tag: '#StartupHayatı', count: '389' }]
export const SECTORS = ['Teknoloji', 'Finans', 'Pazarlama', 'İK', 'Danışmanlık', 'E-ticaret', 'Medya', 'Hukuk']
export const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  brand: { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC' },
  teal: { bg: '#E1F5EE', text: '#085041', border: '#5DCAA5' },
  coral: { bg: '#FAECE7', text: '#712B13', border: '#F0997B' },
  amber: { bg: '#FAEEDA', text: '#633806', border: '#EF9F27' },
  purple: { bg: '#EEEDFE', text: '#534AB7', border: '#7F77DD' },
}
