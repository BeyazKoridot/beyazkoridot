import { supabase } from '@/lib/supabase'

const BASE = 'https://www.otrsocial.com'

export default async function sitemap() {
  let companyUrls: any[] = []
  try {
    const { data: companies } = await supabase
      .from('companies')
      .select('slug, created_at')
      .eq('is_approved', true)
    companyUrls = (companies || []).map((c: any) => ({
      url: `${BASE}/sirketler/${c.slug}`,
      lastModified: c.created_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (e) {}

  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/sirketler`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/maas`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/is-ilanlari`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE}/hakkinda`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE}/iletisim`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/topluluk-kurallari`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/kvkk`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE}/kullanim-kosullari`, priority: 0.4, changeFrequency: 'monthly' as const },
  ]

  return [
    ...staticPages.map(p => ({ ...p, lastModified: new Date() })),
    ...companyUrls,
  ]
}
