export default async function sitemap() {
  let companyUrls: any[] = []
  try {
    const { supabase } = await import('@/lib/supabase')
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
  



  return [
    {
      url: 'https://otrsocial.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://otrsocial.com/sirketler',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://otrsocial.com/maas',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...companyUrls,
  ]
}
