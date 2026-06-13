import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://baile.fyi'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events, listings] = await Promise.all([
    supabase
      .from('posts')
      .select('id, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('events')
      .select('id, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('directory_listings')
      .select('id, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/feed`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/events`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/directory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/help`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/guidelines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const postRoutes: MetadataRoute.Sitemap = (posts.data ?? []).map((p) => ({
    url: `${BASE}/feed/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const eventRoutes: MetadataRoute.Sitemap = (events.data ?? []).map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: new Date(e.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const listingRoutes: MetadataRoute.Sitemap = (listings.data ?? []).map((l) => ({
    url: `${BASE}/directory/${l.id}`,
    lastModified: new Date(l.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...eventRoutes, ...listingRoutes]
}
