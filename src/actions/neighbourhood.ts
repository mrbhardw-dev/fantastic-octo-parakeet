'use server'

import { cookies } from 'next/headers'
import { COOKIE_NAME, NEIGHBOURHOODS, getNeighbourhood } from '@/lib/neighbourhoods'

export async function setNeighbourhood(slug: string): Promise<void> {
  const valid = NEIGHBOURHOODS.find((n) => n.slug === slug && n.active)
  if (!valid) return
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, slug, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function getNeighbourhoodFromCookie() {
  const cookieStore = await cookies()
  const slug = cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock'
  return getNeighbourhood(slug)
}
