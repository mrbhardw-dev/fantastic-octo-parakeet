import Link from 'next/link'
import { cookies } from 'next/headers'
import { HandHeart, AlertTriangle, PlusCircle, LifeBuoy, Users, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { getHelpPosts } from '@/actions/help'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'
import type { HelpType } from '@/types'

export const metadata: Metadata = {
  title: 'Neighbour Help Board',
  description: 'Ask for help or offer support to your neighbours in Kilcock, Co. Kildare.',
  alternates: { canonical: 'https://baile.fyi/help' },
}

interface Props { searchParams: Promise<{ type?: string }> }

export default async function HelpPage({ searchParams }: Props) {
  const { type } = await searchParams
  const validType = type === 'need' || type === 'offer' ? type as HelpType : undefined

  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')

  const posts = await getHelpPosts(validType, hood.town)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Neighbour Help Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ask for help or offer support in {hood.name}
            {posts.length > 0 && (
              <span className="ml-1">· <span className="font-medium text-foreground">{posts.length}</span> active</span>
            )}
          </p>
        </div>
        <Link href="/help/new">
          <Button className="cursor-pointer gap-2 min-h-[44px]">
            <PlusCircle size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Post on the board</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </Link>
      </div>

      {/* Safety notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 px-4 py-3 mb-6">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-900 dark:text-amber-200">
          <strong>Safety first:</strong> Never share your exact home address or personal contact details publicly.
          Exchange details privately once you&rsquo;ve found someone to help.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-8" role="group" aria-label="Filter by type">
        <Link href="/help">
          <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px] ${
            !validType
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
          }`}>
            <LayoutGrid size={13} aria-hidden="true" />
            All
          </button>
        </Link>
        <Link href="/help?type=need">
          <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px] ${
            validType === 'need'
              ? 'bg-destructive text-destructive-foreground border-destructive shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:border-destructive/40 hover:text-foreground'
          }`}>
            <LifeBuoy size={13} aria-hidden="true" />
            Need help
          </button>
        </Link>
        <Link href="/help?type=offer">
          <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px] ${
            validType === 'offer'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:border-emerald-400 hover:text-foreground'
          }`}>
            <Users size={13} aria-hidden="true" />
            Can help
          </button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <HandHeart size={28} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No posts yet</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Be the first to ask for help or offer support to the {hood.name} community.
          </p>
          <Link href="/help/new"><Button className="cursor-pointer">Post on the board</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post) => {
            const isNeed = post.type === 'need'
            return (
              <article key={post.id} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 flex flex-col">
                  <CardContent className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs font-medium gap-1 ${
                          isNeed
                            ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50'
                        }`}
                        variant="outline"
                      >
                        {isNeed ? (
                          <LifeBuoy size={10} aria-hidden="true" />
                        ) : (
                          <HandHeart size={10} aria-hidden="true" />
                        )}
                        {isNeed ? 'Needs help' : 'Can help'}
                      </Badge>
                    </div>
                    <Link
                      href={`/help/${post.id}`}
                      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded block"
                    >
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-150 leading-snug">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">{post.body}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <p className="text-xs text-muted-foreground">
                        {post.profiles?.display_name && (
                          <span className="font-medium text-foreground">{post.profiles.display_name}</span>
                        )}{' '}
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                      <ReportButton contentId={post.id} contentType="help_post" />
                    </div>
                  </CardContent>
                </Card>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
