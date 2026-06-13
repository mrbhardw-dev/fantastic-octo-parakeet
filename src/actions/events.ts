'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { getOrCreateProfileId } from '@/lib/profile'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import type { Event } from '@/types'

const EventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime().optional().or(z.literal('')),
  venue_name: z.string().max(200).optional(),
  source_url: z.string().url().optional().or(z.literal('')),
})

export async function createEvent(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const raw = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    starts_at: formData.get('starts_at') as string,
    ends_at: formData.get('ends_at') as string || undefined,
    venue_name: formData.get('venue_name') as string || undefined,
    source_url: formData.get('source_url') as string || undefined,
  }

  const parsed = EventSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profileId = await getOrCreateProfileId(userId)
  if (!profileId) return { error: 'Could not resolve your profile. Please try signing out and back in.' }

  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')

  const { error } = await supabase.from('events').insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    starts_at: parsed.data.starts_at,
    ends_at: parsed.data.ends_at || null,
    venue_name: parsed.data.venue_name || null,
    source_url: parsed.data.source_url || null,
    town: hood.town,
    county: hood.county,
    status: 'pending',
    created_by: profileId,
  })

  if (error) return { error: 'Failed to create event. Please try again.' }

  revalidatePath('/events')
  return { success: true }
}

export async function getUpcomingEvents(limit = 20, town?: string): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*, profiles(display_name)')
    .eq('status', 'approved')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit)

  if (town) query = query.eq('town', town)

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as unknown as Event[]
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*, profiles(display_name)')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error) return null
  return data as unknown as Event
}

export async function reportEvent(eventId: string, reason: string) {
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
    content_type: 'event',
    content_id: eventId,
    reason,
  })

  if (error) return { error: 'Failed to submit report.' }
  return { success: true }
}
