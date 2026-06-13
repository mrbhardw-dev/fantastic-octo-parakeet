import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Phone, Mail, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReportButton from '@/components/feed/ReportButton'
import { getListingById } from '@/actions/directory'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return { title: 'Listing not found' }
  const description = listing.description?.slice(0, 160)
    ?? `${listing.name} — ${listing.category} in ${listing.town}, Co. Kildare.`
  return {
    title: listing.name,
    description,
    alternates: { canonical: `https://baile.fyi/directory/${id}` },
    openGraph: {
      title: listing.name,
      description,
      type: 'website',
      url: `https://baile.fyi/directory/${id}`,
    },
    twitter: { card: 'summary', title: listing.name, description },
  }
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  const hasContact = listing.website || listing.phone || listing.email

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    ...(listing.description ? { description: listing.description } : {}),
    ...(listing.website ? { url: listing.website } : {}),
    ...(listing.phone ? { telephone: listing.phone } : {}),
    ...(listing.email ? { email: listing.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.town,
      addressRegion: `Co. ${listing.county}`,
      addressCountry: 'IE',
    },
    sameAs: listing.website ? [listing.website] : undefined,
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Link href="/directory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        <ArrowLeft size={16} aria-hidden="true" /> Back to directory
      </Link>

      <article>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">{listing.name}</h1>
          <Badge variant="secondary" className="text-xs shrink-0 mt-1">{listing.category}</Badge>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <MapPin size={13} aria-hidden="true" />
          {listing.town}, Co. {listing.county}
        </p>

        {listing.description && (
          <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-8 text-[15px] pb-6 border-b border-border">
            {listing.description}
          </p>
        )}

        {/* Contact CTAs */}
        {hasContact && (
          <div className="space-y-3 mb-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Contact</h2>
            <div className="flex flex-col gap-2.5">
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                >
                  <Button variant="outline" className="w-full cursor-pointer gap-2 justify-start min-h-[44px]">
                    <Globe size={15} className="text-primary" aria-hidden="true" />
                    <span className="truncate">{listing.website.replace(/^https?:\/\//, '')}</span>
                  </Button>
                </a>
              )}
              {listing.phone && (
                <a href={`tel:${listing.phone}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                  <Button variant="outline" className="w-full cursor-pointer gap-2 justify-start min-h-[44px]">
                    <Phone size={15} className="text-primary" aria-hidden="true" />
                    {listing.phone}
                  </Button>
                </a>
              )}
              {listing.email && (
                <a href={`mailto:${listing.email}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                  <Button variant="outline" className="w-full cursor-pointer gap-2 justify-start min-h-[44px]">
                    <Mail size={15} className="text-primary" aria-hidden="true" />
                    <span className="truncate">{listing.email}</span>
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-border">
          {listing.profiles?.display_name ? (
            <p className="text-xs text-muted-foreground">
              Listed by <span className="font-medium text-foreground">{listing.profiles.display_name}</span>
            </p>
          ) : <div />}
          <ReportButton contentId={listing.id} contentType="directory" />
        </div>
      </article>
    </div>
  )
}
