'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import type { DirectoryListing, DirectoryCategory } from '@/types'

const ListingSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.enum([
    'Food & Drink', 'Shops', 'Trades', 'Health',
    'Schools & Childcare', 'Clubs & Sports', 'Transport', 'Community Groups',
  ]),
  description: z.string().max(2000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional().or(z.literal('')),
})

export async function createDirectoryListing(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const raw = {
    name: formData.get('name') as string,
    category: formData.get('category') as DirectoryCategory,
    description: formData.get('description') as string || undefined,
    website: formData.get('website') as string || undefined,
    phone: formData.get('phone') as string || undefined,
    email: formData.get('email') as string || undefined,
  }

  const parsed = ListingSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return { error: 'Profile not found.' }

  const { error } = await supabase.from('directory_listings').insert({
    name: parsed.data.name,
    category: parsed.data.category,
    description: parsed.data.description || null,
    website: parsed.data.website || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    town: 'Kilcock',
    county: 'Kildare',
    status: 'pending',
    created_by: profile.id,
  })

  if (error) return { error: 'Failed to create listing. Please try again.' }

  revalidatePath('/directory')
  return { success: true }
}

export async function getDirectoryListings(
  category?: DirectoryCategory,
  limit = 50,
): Promise<DirectoryListing[]> {
  let query = supabase
    .from('directory_listings')
    .select('*, profiles(display_name)')
    .eq('status', 'approved')
    .order('name', { ascending: true })
    .limit(limit)

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as unknown as DirectoryListing[]
}

export async function getListingById(id: string): Promise<DirectoryListing | null> {
  const { data, error } = await supabase
    .from('directory_listings')
    .select('*, profiles(display_name)')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error) return null
  return data as unknown as DirectoryListing
}

export async function reportListing(listingId: string, reason: string) {
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
    content_type: 'directory',
    content_id: listingId,
    reason,
  })

  if (error) return { error: 'Failed to submit report.' }
  return { success: true }
}
