'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { getOrCreateProfileId } from '@/lib/profile'
import type { HelpPost, HelpType } from '@/types'

const HelpSchema = z.object({
  type: z.enum(['need', 'offer']),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(2000),
})

export async function createHelpPost(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const raw = {
    type: formData.get('type') as HelpType,
    title: formData.get('title') as string,
    body: formData.get('body') as string,
  }

  const parsed = HelpSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profileId = await getOrCreateProfileId(userId)
  if (!profileId) return { error: 'Could not resolve your profile. Please try signing out and back in.' }

  const { error } = await supabase.from('help_posts').insert({
    type: parsed.data.type,
    title: parsed.data.title,
    body: parsed.data.body,
    town: 'Kilcock',
    county: 'Kildare',
    status: 'pending',
    created_by: profileId,
  })

  if (error) return { error: 'Failed to create post. Please try again.' }

  revalidatePath('/help')
  return { success: true }
}

export async function getHelpPosts(type?: HelpType): Promise<HelpPost[]> {
  let query = supabase
    .from('help_posts')
    .select('*, profiles(display_name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50)

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as unknown as HelpPost[]
}

export async function reportHelpPost(helpPostId: string, reason: string) {
  const { userId } = await auth()
  if (!userId) return { error: 'You must be signed in to report content.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: profile.id,
    content_type: 'help_post',
    content_id: helpPostId,
    reason,
  })

  if (error) return { error: 'Failed to submit report.' }
  return { success: true }
}
