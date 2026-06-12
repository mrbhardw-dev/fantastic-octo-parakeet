import { getPendingItems, moderateListing } from '@/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ModerateButtons from '@/components/admin/ModerateButtons'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Directory' }
export const dynamic = 'force-dynamic'

export default async function AdminDirectoryPage() {
  const listings = await getPendingItems('directory') as Array<{
    id: string; name: string; category: string; description: string | null;
    created_at: string; profiles: { display_name: string } | null
  }>

  if (listings.length === 0) {
    return <p className="text-muted-foreground text-sm">No listings pending review.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Listings pending review ({listings.length})</h2>
      {listings.map((listing) => (
        <Card key={listing.id}>
          <CardContent className="p-5">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">{listing.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  by {listing.profiles?.display_name ?? 'Unknown'} &middot;{' '}
                  {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                </span>
              </div>
              <h3 className="font-medium text-foreground">{listing.name}</h3>
              {listing.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>
              )}
            </div>
            <ModerateButtons
              contentId={listing.id}
              contentType="directory"
              onApprove={async (id) => { 'use server'; return moderateListing(id, 'approved') }}
              onReject={async (id, reason) => { 'use server'; return moderateListing(id, 'rejected', reason) }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
