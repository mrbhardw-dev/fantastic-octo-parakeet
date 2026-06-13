import Link from 'next/link'
import { cookies } from 'next/headers'
import { CalendarPlus, MapPin, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventCard from '@/components/events/EventCard'
import { getUpcomingEvents } from '@/actions/events'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events in Kilcock, Co. Kildare — community gatherings, markets, sports, and more.',
  alternates: { canonical: 'https://baile.fyi/events' },
}

export default async function EventsPage() {
  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')

  const events = await getUpcomingEvents(20, hood.town)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blob */}
      <div className="blob-bg top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/50 rounded-full" aria-hidden="true" />

      {/* Hero header */}
      <header className="pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6">
            <MapPin size={12} aria-hidden="true" /> {hood.name}, Co. {hood.county}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
                Upcoming <span className="text-purple-600 italic">Events</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
                Festivals, clubs, matches, and markets happening in {hood.name}.
                {events.length > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                    <CalendarDays size={12} aria-hidden="true" />
                    {events.length} upcoming
                  </span>
                )}
              </p>
            </div>
            <Link href="/events/new" className="shrink-0">
              <Button
                size="lg"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-8 font-black rounded-full transition-all hover:scale-105 shadow-2xl shadow-primary/20 text-xl hover-bounce"
              >
                <CalendarPlus size={22} className="transition-transform group-hover:rotate-12" aria-hidden="true" />
                Add an event
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Event grid */}
      <main className="px-6 pb-40">
        <div className="max-w-6xl mx-auto">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-white/40 backdrop-blur-sm rounded-[4rem] border border-border/50 shadow-inner">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-lg">
                <CalendarDays size={40} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground mb-4">No upcoming events</h2>
              <p className="text-muted-foreground text-xl max-w-sm mb-12 font-medium leading-relaxed">
                Be the first to add an event for the {hood.name} community.
              </p>
              <Link href="/events/new">
                <Button size="lg" className="rounded-full font-black px-12 py-8 text-xl hover-bounce shadow-xl shadow-primary/20">
                  Add an event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
