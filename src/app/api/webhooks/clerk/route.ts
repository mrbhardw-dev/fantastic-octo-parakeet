import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/resend'

type ClerkUserEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    primary_email_address_id: string
    first_name: string | null
    last_name: string | null
    image_url: string | null
    public_metadata: { role?: string }
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: ClerkUserEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkUserEvent
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  const { type, data } = evt

  if (type === 'user.created' || type === 'user.updated') {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id,
    )
    const email = primaryEmail?.email_address ?? ''
    const displayName = [data.first_name, data.last_name].filter(Boolean).join(' ') || email.split('@')[0]
    const role = data.public_metadata?.role ?? 'resident'

    const { error } = await supabase.from('profiles').upsert(
      {
        clerk_user_id: data.id,
        display_name: displayName,
        email,
        avatar_url: data.image_url,
        role,
      },
      { onConflict: 'clerk_user_id' },
    )

    if (error) {
      console.error('Failed to upsert profile:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    if (type === 'user.created') {
      try {
        await sendWelcomeEmail(email, displayName)
      } catch { /* non-fatal */ }
    }
  }

  return NextResponse.json({ received: true })
}
