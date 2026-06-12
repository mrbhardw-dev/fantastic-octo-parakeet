import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { getPostById } from '@/actions/posts'
import { CATEGORY_COLORS } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.body.slice(0, 160) }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  const colorClass = CATEGORY_COLORS[post.category]

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
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
          <div className="text-sm text-muted-foreground">
            {post.profiles?.display_name && (
              <span className="font-medium text-foreground">{post.profiles.display_name}</span>
            )}{' '}
            &middot;{' '}
            <time dateTime={post.created_at} title={format(new Date(post.created_at), 'PPPp')}>
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </time>
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

        <div className="prose prose-sm prose-neutral max-w-none text-foreground">
          <p className="whitespace-pre-wrap leading-relaxed">{post.body}</p>
        </div>
      </article>
    </div>
  )
}
