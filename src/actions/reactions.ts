'use server'

import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export type ReactionType = 'helpful' | 'trust'

export interface ReactionCounts {
  helpful: number
  trust: number
  userReactions: ReactionType[]
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
  const userReactions = (userRes.data ?? []).map((r) => r.reaction_type as ReactionType)

  return { helpful, trust, userReactions }
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
