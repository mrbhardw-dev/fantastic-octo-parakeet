import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Phone, Mail, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { getListingById } from '@/actions/directory'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return { title: 'Listing not found' }
  return { title: listing.name, description: listing.description?.slice(0, 160) }
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        <ArrowLeft size={16} aria-hidden="true" /> Back to directory
      </Link>
      <article>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">{listing.name}</h1>
          <Badge variant="secondary" className="text-xs shrink-0 mt-1">{listing.category}</Badge>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <MapPin size={13} aria-hidden="true" />
          {listing.town}, Co. {listing.county}
        </p>

        {listing.description && (
          <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-6 pb-6 border-b border-border">
            {listing.description}
          </p>
        )}

        <dl className="space-y-3">
          {listing.website && (
            <div className="flex items-center gap-3">
              <dt className="sr-only">Website</dt>
              <Globe size={15} className="text-primary shrink-0" aria-hidden="true" />
              <dd>
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                  {listing.website.replace(/^https?:\/\//, '')}
                </a>
              </dd>
            </div>
          )}
          {listing.phone && (
            <div className="flex items-center gap-3">
              <dt className="sr-only">Phone</dt>
              <Phone size={15} className="text-primary shrink-0" aria-hidden="true" />
              <dd><a href={`tel:${listing.phone}`} className="text-sm hover:text-primary transition-colors cursor-pointer">{listing.phone}</a></dd>
            </div>
          )}
          {listing.email && (
            <div className="flex items-center gap-3">
              <dt className="sr-only">Email</dt>
              <Mail size={15} className="text-primary shrink-0" aria-hidden="true" />
              <dd><a href={`mailto:${listing.email}`} className="text-sm hover:text-primary transition-colors cursor-pointer">{listing.email}</a></dd>
            </div>
          )}
        </dl>

        <div className="flex justify-end mt-8 pt-4 border-t border-border">
          <ReportButton contentId={listing.id} contentType="directory" />
        </div>
      </article>
    </div>
  )
}
