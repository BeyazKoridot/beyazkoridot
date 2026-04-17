import { supabase } from '@/lib/supabase'

export default async function sitemap() {
  const { data: companies } = await supabase
    .from('companies')
    .select('slug, created_at')
    .eq('is_approved', true)

  const companyUrls = (companies || []).map(c => ({
    url: `https://beyazkoridot-app.vercel.app/sirketler/${c.slug}`,
    lastModified: c.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://beyazkoridot-app.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://beyazkoridot-app.vercel.app/sirketler',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://beyazkoridot-app.vercel.app/maas',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...companyUrls,
  ]
}
