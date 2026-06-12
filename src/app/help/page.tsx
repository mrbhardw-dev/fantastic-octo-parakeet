import Link from 'next/link'
import { HandHeart, AlertTriangle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { getHelpPosts } from '@/actions/help'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'
import type { HelpType } from '@/types'

export const metadata: Metadata = { title: 'Neighbour Help Board' }
export const revalidate = 60

interface Props { searchParams: Promise<{ type?: string }> }

export default async function HelpPage({ searchParams }: Props) {
  const { type } = await searchParams
  const validType = type === 'need' || type === 'offer' ? type as HelpType : undefined
  const posts = await getHelpPosts(validType)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Neighbour Help Board</h1>
          <p className="text-sm text-muted-foreground mt-1">Ask for help or offer support in Kilcock</p>
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
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-6">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-900">
          <strong>Safety first:</strong> Never share your exact home address or personal contact details publicly.
          Exchange details privately once you&rsquo;ve found someone to help.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6" role="group" aria-label="Filter by type">
        <Link href="/help">
          <Button variant={!validType ? 'default' : 'outline'} size="sm" className="cursor-pointer min-h-[36px]">All</Button>
        </Link>
        <Link href="/help?type=need">
          <Button variant={validType === 'need' ? 'default' : 'outline'} size="sm" className="cursor-pointer min-h-[36px]">Need help</Button>
        </Link>
        <Link href="/help?type=offer">
          <Button variant={validType === 'offer' ? 'default' : 'outline'} size="sm" className="cursor-pointer min-h-[36px]">Can help</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <HandHeart size={28} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No posts yet</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">Be the first to ask for help or offer support to the community.</p>
          <Link href="/help/new"><Button className="cursor-pointer">Post on the board</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={post.type === 'need' ? 'destructive' : 'default'}
                      className={`text-xs ${post.type === 'offer' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}`}
                    >
                      {post.type === 'need' ? 'Needs help' : 'Can help'}
                    </Badge>
                  </div>
                  <h2 className="font-semibold text-foreground">{post.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{post.body}</p>
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
          ))}
        </div>
      )}
    </div>
  )
}
