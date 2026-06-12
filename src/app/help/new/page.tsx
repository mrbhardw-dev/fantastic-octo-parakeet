import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CreateHelpForm from '@/components/help/CreateHelpForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Post on the Help Board' }

export default async function NewHelpPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/help/new')

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Neighbour Help Board</h1>
        <p className="text-muted-foreground mt-1">Ask for help or offer your support to the Kilcock community.</p>
      </div>
      <CreateHelpForm />
    </div>
  )
}
