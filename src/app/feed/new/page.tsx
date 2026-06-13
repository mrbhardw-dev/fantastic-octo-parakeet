import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreatePostForm from '@/components/feed/CreatePostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Post an update' }

export default async function NewPostPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/feed/new')

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <Link href="/feed" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        <ArrowLeft size={16} aria-hidden="true" /> Back to feed
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post an update</h1>
        <p className="text-muted-foreground mt-1">Share news, alerts, or information with Kilcock.</p>
      </div>
      <CreatePostForm />
    </div>
  )
}
