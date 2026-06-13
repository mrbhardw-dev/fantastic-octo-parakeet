import Link from 'next/link'
import { Globe, Phone, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { DIRECTORY_COLORS, DIRECTORY_ACCENT } from '@/types'
import type { DirectoryListing } from '@/types'

interface DirectoryCardProps {
  listing: DirectoryListing
  showReport?: boolean
}

export default function DirectoryCard({ listing, showReport = true }: DirectoryCardProps) {
  const colorClass = DIRECTORY_COLORS[listing.category] ?? 'bg-gray-100 text-gray-800 border-gray-200'
  const accentClass = DIRECTORY_ACCENT[listing.category] ?? 'border-l-gray-300'

  return (
    <article className="group">
      <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4 ${accentClass}`}>
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/directory/${listing.id}`}
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded block flex-1"
            >
              <h2 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors duration-150">
                {listing.name}
              </h2>
            </Link>
            <Badge className={`${colorClass} border text-xs shrink-0`} variant="outline">
              {listing.category}
            </Badge>
          </div>

          {listing.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {listing.description}
            </p>
          )}

          <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-border">
            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[24px]"
              >
                <Globe size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{listing.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {listing.phone && (
              <a
                href={`tel:${listing.phone}`}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[24px]"
              >
                <Phone size={12} className="shrink-0" aria-hidden="true" />
                {listing.phone}
              </a>
            )}
            {listing.email && (
              <a
                href={`mailto:${listing.email}`}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[24px]"
              >
                <Mail size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{listing.email}</span>
              </a>
            )}
            <div className="flex justify-end mt-1">
              {showReport && <ReportButton contentId={listing.id} contentType="directory" />}
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
