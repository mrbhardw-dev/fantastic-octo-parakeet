'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { getOrCreateProfileId } from '@/lib/profile'

const CommentSchema = z.object({
  body: z.string().min(1).max(1000),
})

export interface Comment {
  id: string
  post_id: string
  body: string
  created_at: string
  profiles?: { display_name: string; avatar_url?: string | null } | null
}

export async function getComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*, profiles(display_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) return []
  return (data ?? []) as unknown as Comment[]
}

export async function createComment(postId: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) return { error: 'Sign in to comment.' }

  const parsed = CommentSchema.safeParse({ body: formData.get('body') as string })
  if (!parsed.success) return { error: 'Comment cannot be empty.' }

  const profileId = await getOrCreateProfileId(userId)
  if (!profileId) return { error: 'Could not resolve your profile.' }

  const { error } = await supabase.from('post_comments').insert({
    post_id: postId,
    profile_id: profileId,
    body: parsed.data.body,
  })

  if (error) return { error: 'Failed to post comment. Please try again.' }

  revalidatePath(`/feed/${postId}`)
  return { success: true }
}
