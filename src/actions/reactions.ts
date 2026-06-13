'use server'

import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export type ReactionType = 'helpful' | 'trust' | 'fire' | 'heart'

export interface ReactionCounts {
  helpful: number
  trust: number
  fire: number
  heart: number
  userReactions: ReactionType[]
}

export interface Contributor {
  profileId: string
  displayName: string
  avatarUrl?: string | null
  helpfulCount: number
  trustCount: number
  fireCount: number
  heartCount: number
  totalCount: number
}

export async function getReactions(postId: string): Promise<ReactionCounts> {
  const { userId } = await auth()

  const [countsRes, userRes] = await Promise.all([
    supabase
      .from('post_reactions')
      .select('reaction_type')
      .eq('post_id', postId),
    userId
      ? supabase
          .from('post_reactions')
          .select('reaction_type')
          .eq('post_id', postId)
          .eq('clerk_user_id', userId)
      : Promise.resolve({ data: [] }),
  ])

  const counts = countsRes.data ?? []
  const helpful = counts.filter((r) => r.reaction_type === 'helpful').length
  const trust = counts.filter((r) => r.reaction_type === 'trust').length
  const fire = counts.filter((r) => r.reaction_type === 'fire').length
  const heart = counts.filter((r) => r.reaction_type === 'heart').length
  const userReactions = (userRes.data ?? []).map((r) => r.reaction_type as ReactionType)

  return { helpful, trust, fire, heart, userReactions }
}

export async function getTopContributors(town?: string, limit = 5): Promise<Contributor[]> {
  let query = supabase
    .from('posts')
    .select(`
      id,
      town,
      profiles(id, display_name, avatar_url),
      post_reactions(reaction_type)
    `)
    .eq('status', 'approved')
    .limit(500)

  if (town) query = query.eq('town', town)

  const { data, error } = await query
  if (error || !data) return []

  const map = new Map<string, Contributor>()

  for (const post of data as any[]) {
    const profile = post.profiles
    if (!profile) continue

    const key = profile.id
    if (!map.has(key)) {
      map.set(key, {
        profileId: profile.id,
        displayName: profile.display_name ?? 'Community member',
        avatarUrl: profile.avatar_url ?? null,
        helpfulCount: 0,
        trustCount: 0,
        fireCount: 0,
        heartCount: 0,
        totalCount: 0,
      })
    }

    const c = map.get(key)!
    for (const r of post.post_reactions ?? []) {
      c.totalCount++
      if (r.reaction_type === 'helpful') c.helpfulCount++
      else if (r.reaction_type === 'trust') c.trustCount++
      else if (r.reaction_type === 'fire') c.fireCount++
      else if (r.reaction_type === 'heart') c.heartCount++
    }
  }

  // Trust reactions score double — they represent community credibility
  return Array.from(map.values())
    .filter((c) => c.totalCount > 0)
    .sort((a, b) => {
      const score = (c: Contributor) => c.trustCount * 2 + c.helpfulCount + c.fireCount + c.heartCount
      return score(b) - score(a)
    })
    .slice(0, limit)
}

export async function toggleReaction(postId: string, reaction: ReactionType) {
  const { userId } = await auth()
  if (!userId) return { error: 'Sign in to react to posts.' }

  const { data: existing } = await supabase
    .from('post_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('clerk_user_id', userId)
    .eq('reaction_type', reaction)
    .single()

  if (existing) {
    await supabase.from('post_reactions').delete().eq('id', existing.id)
  } else {
    await supabase.from('post_reactions').insert({
      post_id: postId,
      clerk_user_id: userId,
      reaction_type: reaction,
    })
  }

  return { success: true }
}
