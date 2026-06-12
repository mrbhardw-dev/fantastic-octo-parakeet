import 'server-only'
import { currentUser } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

/**
 * Returns the Supabase profile id for the current Clerk user.
 * Creates the profile on the fly if the webhook hasn't fired yet.
 */
export async function getOrCreateProfileId(clerkUserId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (existing) return existing.id

  // Profile missing — bootstrap it from Clerk user data
  const user = await currentUser()
  if (!user) return null

  const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
  const email = primaryEmail?.emailAddress ?? ''
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || email.split('@')[0]

  const { data: created } = await supabase
    .from('profiles')
    .upsert(
      {
        clerk_user_id: clerkUserId,
        display_name: displayName,
        email,
        avatar_url: user.imageUrl ?? null,
        role: 'resident',
      },
      { onConflict: 'clerk_user_id' },
    )
    .select('id')
    .single()

  return created?.id ?? null
}
