'use server'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { addPostActivity, removePostActivity } from '@/lib/stream'
import { indexPost, indexEvent, indexDirectoryListing, removeFromIndex, INDICES } from '@/lib/algolia'
import { sendModerationEmail } from '@/lib/resend'
import type { ContentType } from '@/types'

type ApproveOrReject = 'approved' | 'rejected'

async function requireModerator() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, display_name, email')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile || !['admin', 'moderator'].includes(profile.role)) {
    redirect('/')
  }
  return profile
}

export async function getPendingCounts() {
  const [posts, events, listings, helpPosts, reports] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('directory_listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('help_posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('id', { count: 'exact', head: true }),
  ])

  return {
    posts: posts.count ?? 0,
    events: events.count ?? 0,
    listings: listings.count ?? 0,
    helpPosts: helpPosts.count ?? 0,
    reports: reports.count ?? 0,
  }
}

export async function getPendingItems(contentType: ContentType) {
  await requireModerator()

  const tableMap: Record<ContentType, string> = {
    post: 'posts',
    event: 'events',
    directory: 'directory_listings',
    help_post: 'help_posts',
  }
  const table = tableMap[contentType]

  const { data, error } = await supabase
    .from(table)
    .select('*, profiles(display_name, email)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) return []
  return data ?? []
}

export async function getReports() {
  await requireModerator()

  const { data, error } = await supabase
    .from('reports')
    .select('*, reporter:profiles!reporter_id(display_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return []
  return data ?? []
}

type ModerateResult = { success: boolean; error?: string }

export async function moderatePost(
  postId: string,
  status: ApproveOrReject,
  rejectReason?: string,
): Promise<ModerateResult> {
  await requireModerator()

  // Fetch post + submitter
  const { data: post, error: fetchErr } = await supabase
    .from('posts')
    .select('*, profiles(display_name, email)')
    .eq('id', postId)
    .single()

  if (fetchErr || !post) return { success: false, error: 'Post not found.' }

  // Update status
  const { error: updateErr } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)

  if (updateErr) return { success: false, error: 'Failed to update status.' }

  // Side effects
  if (status === 'approved') {
    try {
      const streamId = await addPostActivity({
        postId: post.id,
        profileId: post.created_by,
        title: post.title,
        category: post.category,
        town: post.town,
      })
      await supabase.from('posts').update({ stream_activity_id: streamId }).eq('id', postId)
      await indexPost({
        id: post.id,
        title: post.title,
        body: post.body,
        category: post.category,
        town: post.town,
        county: post.county,
        created_at: post.created_at,
      })
    } catch { /* non-fatal */ }
  } else if (status === 'rejected' && post.stream_activity_id) {
    try {
      await removePostActivity(post.stream_activity_id, post.town)
      await removeFromIndex(INDICES.posts, post.id)
    } catch { /* non-fatal */ }
  }

  // Email notification
  const submitter = post.profiles as { display_name: string; email: string } | null
  if (submitter) {
    try {
      await sendModerationEmail(
        submitter.email,
        submitter.display_name,
        'post',
        post.title,
        status,
        rejectReason,
      )
    } catch { /* non-fatal */ }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/feed')
  return { success: true }
}

export async function moderateEvent(
  eventId: string,
  status: ApproveOrReject,
  rejectReason?: string,
): Promise<ModerateResult> {
  await requireModerator()

  const { data: event, error: fetchErr } = await supabase
    .from('events')
    .select('*, profiles(display_name, email)')
    .eq('id', eventId)
    .single()

  if (fetchErr || !event) return { success: false, error: 'Event not found.' }

  const { error: updateErr } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId)

  if (updateErr) return { success: false, error: 'Failed to update status.' }

  if (status === 'approved') {
    try {
      await indexEvent({
        id: event.id,
        title: event.title,
        description: event.description,
        town: event.town,
        county: event.county,
        starts_at: event.starts_at,
      })
    } catch { /* non-fatal */ }
  } else if (status === 'rejected') {
    try {
      await removeFromIndex(INDICES.events, event.id)
    } catch { /* non-fatal */ }
  }

  const submitter = event.profiles as { display_name: string; email: string } | null
  if (submitter) {
    try {
      await sendModerationEmail(submitter.email, submitter.display_name, 'event', event.title, status, rejectReason)
    } catch { /* non-fatal */ }
  }

  revalidatePath('/admin/events')
  revalidatePath('/events')
  return { success: true }
}

export async function moderateListing(
  listingId: string,
  status: ApproveOrReject,
  rejectReason?: string,
): Promise<ModerateResult> {
  await requireModerator()

  const { data: listing, error: fetchErr } = await supabase
    .from('directory_listings')
    .select('*, profiles(display_name, email)')
    .eq('id', listingId)
    .single()

  if (fetchErr || !listing) return { success: false, error: 'Listing not found.' }

  const { error: updateErr } = await supabase
    .from('directory_listings')
    .update({ status })
    .eq('id', listingId)

  if (updateErr) return { success: false, error: 'Failed to update status.' }

  if (status === 'approved') {
    try {
      await indexDirectoryListing({
        id: listing.id,
        name: listing.name,
        category: listing.category,
        description: listing.description,
        town: listing.town,
        county: listing.county,
      })
    } catch { /* non-fatal */ }
  } else if (status === 'rejected') {
    try {
      await removeFromIndex(INDICES.directory, listing.id)
    } catch { /* non-fatal */ }
  }

  const submitter = listing.profiles as { display_name: string; email: string } | null
  if (submitter) {
    try {
      await sendModerationEmail(submitter.email, submitter.display_name, 'directory listing', listing.name, status, rejectReason)
    } catch { /* non-fatal */ }
  }

  revalidatePath('/admin/directory')
  revalidatePath('/directory')
  return { success: true }
}

export async function postQuickAlert(
  title: string,
  body: string,
): Promise<ModerateResult> {
  const moderator = await requireModerator()

  // Only admins can post quick alerts
  if (moderator.role !== 'admin') {
    return { success: false, error: 'Only admins can post quick alerts.' }
  }

  const { data: post, error: insertErr } = await supabase
    .from('posts')
    .insert({
      title,
      body,
      category: 'Alert',
      town: 'Kilcock',
      county: 'Kildare',
      status: 'approved',
      created_by: moderator.id,
    })
    .select('id, title, category, town, county, created_at')
    .single()

  if (insertErr || !post) return { success: false, error: 'Failed to create alert.' }

  try {
    const streamId = await addPostActivity({
      postId: post.id,
      profileId: moderator.id,
      title: post.title,
      category: post.category,
      town: post.town,
    })
    await supabase.from('posts').update({ stream_activity_id: streamId }).eq('id', post.id)
    await indexPost({
      id: post.id,
      title: post.title,
      body,
      category: post.category,
      town: post.town,
      county: post.county,
      created_at: post.created_at,
    })
  } catch { /* non-fatal */ }

  revalidatePath('/admin')
  revalidatePath('/feed')
  return { success: true }
}

export async function moderateHelpPost(
  helpPostId: string,
  status: ApproveOrReject,
  rejectReason?: string,
): Promise<ModerateResult> {
  await requireModerator()

  const { data: post, error: fetchErr } = await supabase
    .from('help_posts')
    .select('*, profiles(display_name, email)')
    .eq('id', helpPostId)
    .single()

  if (fetchErr || !post) return { success: false, error: 'Post not found.' }

  const { error: updateErr } = await supabase
    .from('help_posts')
    .update({ status })
    .eq('id', helpPostId)

  if (updateErr) return { success: false, error: 'Failed to update status.' }

  const submitter = post.profiles as { display_name: string; email: string } | null
  if (submitter) {
    try {
      await sendModerationEmail(submitter.email, submitter.display_name, 'help post', post.title, status, rejectReason)
    } catch { /* non-fatal */ }
  }

  revalidatePath('/admin/help')
  revalidatePath('/help')
  return { success: true }
}
