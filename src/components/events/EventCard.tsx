import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
  showReport?: boolean
}

export default function EventCard({ event, showReport = true }: EventCardProps) {
  const start = new Date(event.starts_at)

  return (
    <article className="group">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30">
        {/* Date block */}
        <div className="flex items-center gap-4 bg-primary/8 px-5 py-4 border-b border-border">
          <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg w-12 h-12 shrink-0">
            <span className="text-xs font-medium leading-none">{format(start, 'MMM')}</span>
            <span className="text-xl font-bold leading-none">{format(start, 'd')}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{format(start, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-xs text-muted-foreground">{format(start, 'p')}{event.ends_at ? ` – ${format(new Date(event.ends_at), 'p')}` : ''}</p>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col gap-3">
          <Link
            href={`/events/${event.id}`}
            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded block"
          >
            <h2 className="font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-150">
              {event.title}
            </h2>
          </Link>

          {event.venue_name && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={13} className="shrink-0" aria-hidden="true" />
              {event.venue_name}
            </p>
          )}

          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Calendar size={10} className="mr-1" aria-hidden="true" />
                Event
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={10} aria-hidden="true" />
                {event.town}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {event.source_url && (
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="More info (opens in new tab)"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] min-w-[44px] justify-center"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              )}
              {showReport && <ReportButton contentId={event.id} contentType="event" />}
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
