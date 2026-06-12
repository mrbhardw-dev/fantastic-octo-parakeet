import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReportButton from '@/components/feed/ReportButton'
import { getEventById } from '@/actions/events'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) return { title: 'Event not found' }
  return { title: event.title, description: event.description?.slice(0, 160) }
}

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  const start = new Date(event.starts_at)

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        <ArrowLeft size={16} aria-hidden="true" /> Back to events
      </Link>
      <article>
        <Badge variant="secondary" className="mb-4"><Calendar size={11} className="mr-1" aria-hidden="true" />Event</Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 leading-snug">{event.title}</h1>

        <dl className="space-y-3 mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <dt className="sr-only">Date and time</dt>
            <Calendar size={15} className="text-primary shrink-0" aria-hidden="true" />
            <dd className="text-foreground">
              {format(start, 'EEEE, MMMM d, yyyy')} at {format(start, 'p')}
              {event.ends_at && ` – ${format(new Date(event.ends_at), 'p')}`}
            </dd>
          </div>
          {event.venue_name && (
            <div className="flex items-center gap-2 text-sm">
              <dt className="sr-only">Venue</dt>
              <MapPin size={15} className="text-primary shrink-0" aria-hidden="true" />
              <dd className="text-foreground">{event.venue_name}, {event.town}</dd>
            </div>
          )}
        </dl>

        {event.description && (
          <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-6">{event.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {event.source_url && (
              <a href={event.source_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="cursor-pointer gap-2">
                  <ExternalLink size={13} aria-hidden="true" />
                  More info
                </Button>
              </a>
            )}
          </div>
          <ReportButton contentId={event.id} contentType="event" />
        </div>
      </article>
    </div>
  )
}
