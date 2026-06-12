import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AddListingForm from '@/components/directory/AddListingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Add a listing' }

export default async function NewListingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/directory/new')

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Add a local listing</h1>
        <p className="text-muted-foreground mt-1">List a Kilcock business, trade, club, or community group.</p>
      </div>
      <AddListingForm />
    </div>
  )
}
