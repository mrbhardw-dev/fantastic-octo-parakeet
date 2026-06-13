'use server'

import { supabase } from '@/lib/supabase'

export async function getCommunityStats(town?: string) {
  let postsQ = supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'approved')
  let eventsQ = supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'approved').gte('starts_at', new Date().toISOString())
  let listingsQ = supabase.from('directory_listings').select('id', { count: 'exact', head: true }).eq('status', 'approved')

  if (town) {
    postsQ = postsQ.eq('town', town)
    eventsQ = eventsQ.eq('town', town)
    listingsQ = listingsQ.eq('town', town)
  }

  const [postsRes, eventsRes, listingsRes] = await Promise.all([postsQ, eventsQ, listingsQ])
  return {
    posts: postsRes.count ?? 0,
    events: eventsRes.count ?? 0,
    businesses: listingsRes.count ?? 0,
  }
}
