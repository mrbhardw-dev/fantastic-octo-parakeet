import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CreateEventForm from '@/components/events/CreateEventForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Add an event' }

export default async function NewEventPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/events/new')

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Add an event</h1>
        <p className="text-muted-foreground mt-1">Share an upcoming event with the Kilcock community.</p>
      </div>
      <CreateEventForm />
    </div>
  )
}
