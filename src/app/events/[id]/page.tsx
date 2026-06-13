import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, MapPin, Calendar, ExternalLink, CalendarPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReportButton from '@/components/feed/ReportButton'
import { getEventById } from '@/actions/events'
import type { Metadata } from 'next'
import type { Event } from '@/types'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) return { title: 'Event not found' }
  const description = event.description?.slice(0, 160)
    ?? `Event in ${event.town}, Co. Kildare on ${format(new Date(event.starts_at), 'MMMM d, yyyy')}.`
  return {
    title: event.title,
    description,
    alternates: { canonical: `https://baile.fyi/events/${id}` },
    openGraph: {
      title: event.title,
      description,
      type: 'article',
      url: `https://baile.fyi/events/${id}`,
      publishedTime: event.created_at,
    },
    twitter: { card: 'summary', title: event.title, description },
  }
}

function googleCalendarUrl(event: Event) {
  const toGCal = (d: string) => format(new Date(d), "yyyyMMdd'T'HHmmss")
  const endDate = event.ends_at
    ?? new Date(new Date(event.starts_at).getTime() + 60 * 60 * 1000).toISOString()
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toGCal(event.starts_at)}/${toGCal(endDate)}`,
    location: event.venue_name
      ? `${event.venue_name}, ${event.town}, Co. Kildare, Ireland`
      : `${event.town}, Co. Kildare, Ireland`,
  })
  if (event.description) params.set('details', event.description)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  const start = new Date(event.starts_at)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    ...(event.description ? { description: event.description } : {}),
    startDate: event.starts_at,
    ...(event.ends_at ? { endDate: event.ends_at } : {}),
    location: {
      '@type': 'Place',
      name: event.venue_name ?? `${event.town}, Co. Kildare`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.town,
        addressRegion: `Co. ${event.county}`,
        addressCountry: 'IE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'baile.fyi community',
      url: 'https://baile.fyi',
    },
    url: `https://baile.fyi/events/${event.id}`,
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        <ArrowLeft size={16} aria-hidden="true" /> Back to events
      </Link>

      <article>
        {/* Date hero block */}
        <div className="flex items-center gap-4 rounded-xl bg-primary/8 border border-primary/20 px-5 py-4 mb-6">
          <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg w-14 h-14 shrink-0">
            <span className="text-xs font-medium leading-none uppercase tracking-wide">{format(start, 'MMM')}</span>
            <span className="text-2xl font-bold leading-none">{format(start, 'd')}</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{format(start, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(start, 'p')}
              {event.ends_at && ` – ${format(new Date(event.ends_at), 'p')}`}
            </p>
            {event.venue_name && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin size={12} aria-hidden="true" />
                {event.venue_name}, {event.town}
              </p>
            )}
          </div>
        </div>

        <Badge variant="secondary" className="mb-4 gap-1">
          <Calendar size={11} aria-hidden="true" />
          Event
        </Badge>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-5 leading-snug">{event.title}</h1>

        {event.description && (
          <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-6 text-[15px]">
            {event.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-border">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Button variant="outline" size="sm" className="cursor-pointer gap-2">
              <CalendarPlus size={14} aria-hidden="true" />
              Add to Google Calendar
            </Button>
          </a>
          {event.source_url && (
            <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
              <Button variant="outline" size="sm" className="cursor-pointer gap-2">
                <ExternalLink size={13} aria-hidden="true" />
                More info
              </Button>
            </a>
          )}
          <div className="ml-auto">
            <ReportButton contentId={event.id} contentType="event" />
          </div>
        </div>

        {/* Submitted by */}
        {event.profiles?.display_name && (
          <p className="mt-5 text-xs text-muted-foreground">
            Submitted by <span className="font-medium text-foreground">{event.profiles.display_name}</span>
          </p>
        )}
      </article>
    </div>
  )
}
