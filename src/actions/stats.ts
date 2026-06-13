'use server'

import { supabase } from '@/lib/supabase'

export async function getCommunityStats() {
  const [postsRes, eventsRes, listingsRes] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'approved').gte('starts_at', new Date().toISOString()),
    supabase.from('directory_listings').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
  ])
  return {
    posts: postsRes.count ?? 0,
    events: eventsRes.count ?? 0,
    businesses: listingsRes.count ?? 0,
  }
}
