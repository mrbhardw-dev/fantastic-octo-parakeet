import Link from 'next/link'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventCard from '@/components/events/EventCard'
import { getUpcomingEvents } from '@/actions/events'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events in Kilcock, Co. Kildare — community gatherings, markets, sports, and more.',
  alternates: { canonical: 'https://baile.fyi/events' },
}
export const revalidate = 60

export default async function EventsPage() {
  const events = await getUpcomingEvents()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upcoming Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            What&rsquo;s on in Kilcock, Co. Kildare
            {events.length > 0 && (
              <span className="ml-1">· <span className="font-medium text-foreground">{events.length}</span> upcoming</span>
            )}
          </p>
        </div>
        <Link href="/events/new">
          <Button className="cursor-pointer gap-2 min-h-[44px]">
            <CalendarPlus size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Add an event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <CalendarPlus size={28} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No upcoming events</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">Be the first to add an event for the Kilcock community.</p>
          <Link href="/events/new"><Button className="cursor-pointer">Add an event</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
