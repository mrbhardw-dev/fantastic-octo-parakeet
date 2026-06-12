import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CreatePostForm from '@/components/feed/CreatePostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Post an update' }

export default async function NewPostPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/feed/new')

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post an update</h1>
        <p className="text-muted-foreground mt-1">Share news, alerts, or information with Kilcock.</p>
      </div>
      <CreatePostForm />
    </div>
  )
}
