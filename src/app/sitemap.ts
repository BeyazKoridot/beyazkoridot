import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const unvanSlugs = ['senior', 'junior', 'mid-level', 'lead', 'manager', 'director', 'stajyer', 'c-level']
  const unvanUrls = unvanSlugs.map(slug => ({
    url: `https://otrsocial.com/maas/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  let companyUrls: any[] = []
  try {
    const { data: companies } = await supabase
      .from('companies')
      .select('slug, created_at')
      .eq('is_approved', true)
    companyUrls = (companies || []).map((c: any) => ({
      url: `https://otrsocial.com/sirketler/${c.slug}`,
      lastModified: c.created_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (e) {}

  const staticPages = [
    { url: 'https://otrsocial.com', priority: 1.0, changeFrequency: 'daily' as const },
    { url: 'https://otrsocial.com/sirketler', priority: 0.9, changeFrequency: 'daily' as const },
    { url: 'https://otrsocial.com/maas', priority: 0.9, changeFrequency: 'daily' as const },
    { url: 'https://otrsocial.com/hakkinda', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: 'https://otrsocial.com/iletisim', priority: 0.4, changeFrequency: 'monthly' as const },
    { url: 'https://otrsocial.com/kvkk', priority: 0.3, changeFrequency: 'monthly' as const },
    { url: 'https://otrsocial.com/kullanim-kosullari', priority: 0.3, changeFrequency: 'monthly' as const },
    { url: 'https://otrsocial.com/topluluk-kurallari', priority: 0.4, changeFrequency: 'monthly' as const },
  ].map(p => ({ ...p, lastModified: new Date() }))

  return [...staticPages, ...unvanUrls, ...companyUrls]
}
