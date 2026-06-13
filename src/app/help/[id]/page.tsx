import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { ArrowLeft, AlertTriangle, LifeBuoy, HandHeart, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ReportButton from '@/components/feed/ReportButton'
import { getHelpPostById, getHelpPosts } from '@/actions/help'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getHelpPostById(id)
  if (!post) return { title: 'Post not found' }
  const description = post.body.slice(0, 160)
  return {
    title: post.title,
    description,
    alternates: { canonical: `https://baile.fyi/help/${id}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      url: `https://baile.fyi/help/${id}`,
    },
    twitter: { card: 'summary', title: post.title, description },
  }
}

export default async function HelpPostPage({ params }: Props) {
  const { id } = await params
  const [post, morePosts] = await Promise.all([
    getHelpPostById(id),
    getHelpPosts(),
  ])
  if (!post) notFound()

  const isNeed = post.type === 'need'
  const relatedPosts = morePosts.filter((p) => p.id !== id).slice(0, 3)

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <Link
        href="/help"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to help board
      </Link>

      <article>
        <div className="flex items-center gap-3 mb-4">
          <Badge
            className={`text-xs font-medium gap-1 ${
              isNeed
                ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50'
            }`}
            variant="outline"
          >
            {isNeed ? <LifeBuoy size={11} aria-hidden="true" /> : <HandHeart size={11} aria-hidden="true" />}
            {isNeed ? 'Needs help' : 'Can help'}
          </Badge>
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
          <ReportButton contentId={post.id} contentType="help_post" />
        </div>

        <p className="whitespace-pre-wrap leading-relaxed text-[15px] text-foreground mb-8">
          {post.body}
        </p>

        {/* Safety reminder */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 px-4 py-3">
          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Safety first:</strong> Never share your exact home address or personal contact details publicly.
            Exchange details privately once you&rsquo;ve found someone to help.
          </p>
        </div>
      </article>

      {/* More from the board */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">More from the help board</h2>
            <Link
              href="/help"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              See all <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedPosts.map((p) => {
              const pIsNeed = p.type === 'need'
              return (
                <Link
                  key={p.id}
                  href={`/help/${p.id}`}
                  className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                >
                  <Card className={`h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 border-l-4 ${pIsNeed ? 'border-l-red-400' : 'border-l-emerald-400'}`}>
                    <CardContent className="p-4">
                      <Badge
                        className={`text-xs font-medium gap-1 mb-2 ${
                          pIsNeed
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                        variant="outline"
                      >
                        {pIsNeed ? <LifeBuoy size={9} aria-hidden="true" /> : <HandHeart size={9} aria-hidden="true" />}
                        {pIsNeed ? 'Needs help' : 'Can help'}
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
