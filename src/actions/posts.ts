'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { getOrCreateProfileId } from '@/lib/profile'
import type { Post, PostCategory } from '@/types'

const PostSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
  category: z.enum(['Alert', 'Recommendation', 'Lost & Found', 'Event', 'Local Business', 'Question', 'Community Help']),
  image_url: z.string().url().optional().or(z.literal('')),
})

export async function createPost(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const raw = {
    title: formData.get('title') as string,
    body: formData.get('body') as string,
    category: formData.get('category') as PostCategory,
    image_url: formData.get('image_url') as string || undefined,
  }

  const parsed = PostSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profileId = await getOrCreateProfileId(userId)
  if (!profileId) return { error: 'Could not resolve your profile. Please try signing out and back in.' }

  const { error } = await supabase.from('posts').insert({
    title: parsed.data.title,
    body: parsed.data.body,
    category: parsed.data.category,
    image_url: parsed.data.image_url || null,
    town: 'Kilcock',
    county: 'Kildare',
    status: 'pending',
    created_by: profileId,
  })

  if (error) return { error: 'Failed to create post. Please try again.' }

  revalidatePath('/feed')
  return { success: true }
}

export async function reportPost(postId: string, reason: string) {
  const { userId } = await auth()
  if (!userId) return { error: 'You must be signed in to report content.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  if (!reason || reason.length < 5) return { error: 'Please provide a reason for the report.' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: profile.id,
    content_type: 'post',
    content_id: postId,
    reason,
  })

  if (error) return { error: 'Failed to submit report.' }
  return { success: true }
}

export async function getApprovedPosts(
  category?: PostCategory,
  limit = 20,
  offset = 0,
  excludeId?: string,
): Promise<Post[]> {
  let query = supabase
    .from('posts')
    .select('*, profiles(display_name, avatar_url)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) query = query.eq('category', category)
  if (excludeId) query = query.neq('id', excludeId)

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as unknown as Post[]
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(display_name, avatar_url)')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error) return null
  return data as unknown as Post
}
