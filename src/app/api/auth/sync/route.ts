import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getOrCreateProfileId } from '@/lib/profile'

export async function GET() {
  const { userId } = await auth()
  if (userId) {
    await getOrCreateProfileId(userId)
  }
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL ?? 'https://baile.fyi'))
}
