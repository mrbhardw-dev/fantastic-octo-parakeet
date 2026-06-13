import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowLeft, MapPin, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ReportButton from '@/components/feed/ReportButton'
import { getPostById, getApprovedPosts } from '@/actions/posts'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import { CATEGORY_COLORS, CATEGORY_ACCENT } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) return { title: 'Post not found' }
  const description = post.body.slice(0, 160)
  return {
    title: post.title,
    description,
    alternates: { canonical: `https://baile.fyi/feed/${id}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      url: `https://baile.fyi/feed/${id}`,
      ...(post.image_url ? { images: [{ url: post.image_url, alt: post.title }] } : {}),
    },
    twitter: { card: post.image_url ? 'summary_large_image' : 'summary', title: post.title, description },
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')
  const [post, morePosts] = await Promise.all([
    getPostById(id),
    getApprovedPosts(undefined, 3, 0, id, hood.town),
  ])
  if (!post) notFound()

  const colorClass = CATEGORY_COLORS[post.category]
  const displayName = post.profiles?.display_name
  const avatarUrl = post.profiles?.avatar_url
  const initials = displayName ? displayName[0].toUpperCase() : '?'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.body.slice(0, 160),
    datePublished: post.created_at,
    ...(post.image_url ? { image: post.image_url } : {}),
    author: {
      '@type': 'Person',
      name: displayName ?? 'Community member',
    },
    publisher: {
      '@type': 'Organization',
      name: 'baile.fyi',
      url: 'https://baile.fyi',
    },
    url: `https://baile.fyi/feed/${post.id}`,
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to feed
      </Link>

      <article>
        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${colorClass} border text-xs`} variant="outline">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} aria-hidden="true" />
            {post.town}, Co. {post.county}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-snug">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName ?? ''}
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {displayName && (
                <span className="font-medium text-foreground">{displayName}</span>
              )}{' '}
              &middot;{' '}
              <time dateTime={post.created_at} title={format(new Date(post.created_at), 'PPPp')}>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </time>
            </div>
          </div>
          <ReportButton contentId={post.id} contentType="post" />
        </div>

        {post.image_url && (
          <div className="relative mb-6 h-72 w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="text-foreground">
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{post.body}</p>
        </div>
      </article>

      {/* More from the community */}
      {morePosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">More from the community</h2>
            <Link
              href="/feed"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              See all <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {morePosts.map((p) => {
              const color = CATEGORY_COLORS[p.category] ?? 'bg-gray-100 text-gray-800'
              const accent = CATEGORY_ACCENT[p.category] ?? 'border-l-gray-300'
              return (
                <Link
                  key={p.id}
                  href={`/feed/${p.id}`}
                  className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                >
                  <Card className={`h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 border-l-4 ${accent}`}>
                    <CardContent className="p-4">
                      <Badge className={`${color} border text-xs mb-2`} variant="outline">
                        {p.category}
                      </Badge>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-150 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
