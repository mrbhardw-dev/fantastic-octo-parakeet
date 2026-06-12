import { getPendingItems, moderateEvent } from '@/actions/admin'
import { Card, CardContent } from '@/components/ui/card'
import ModerateButtons from '@/components/admin/ModerateButtons'
import { formatDistanceToNow, format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Events' }
export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const events = await getPendingItems('event') as Array<{
    id: string; title: string; starts_at: string; venue_name: string | null;
    created_at: string; profiles: { display_name: string } | null
  }>

  if (events.length === 0) {
    return <p className="text-muted-foreground text-sm">No events pending review.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Events pending review ({events.length})</h2>
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-5">
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">
                by {event.profiles?.display_name ?? 'Unknown'} &middot;{' '}
                submitted {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </p>
              <h3 className="font-medium text-foreground">{event.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(event.starts_at), 'PPp')}
                {event.venue_name ? ` · ${event.venue_name}` : ''}
              </p>
            </div>
            <ModerateButtons
              contentId={event.id}
              contentType="event"
              onApprove={async (id) => { 'use server'; return moderateEvent(id, 'approved') }}
              onReject={async (id, reason) => { 'use server'; return moderateEvent(id, 'rejected', reason) }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
