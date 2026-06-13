import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  HandHeart, AlertTriangle, PlusCircle, LifeBuoy, Users, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { getHelpPosts } from '@/actions/help'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blob */}
      <div className="blob-bg top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-100/40 rounded-full" aria-hidden="true" />

      {/* Hero header */}
      <header className="pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6">
            <MapPin size={12} aria-hidden="true" /> {hood.name}, Co. {hood.county}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
                Neighbour <span className="text-accent italic">Help</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
                Ask for a hand or offer one — the community looks after its own.
                {posts.length > 0 && (
                  <span className="ml-2 font-bold text-foreground">{posts.length} active</span>
                )}
              </p>
            </div>
            <Link href="/help/new" className="shrink-0">
              <Button
                size="lg"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-8 font-black rounded-full transition-all hover:scale-105 shadow-2xl shadow-primary/20 text-xl hover-bounce"
              >
                <PlusCircle size={22} className="transition-transform group-hover:rotate-12" aria-hidden="true" />
                Post to the board
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6">
        <div className="max-w-6xl mx-auto">
          {/* Safety notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 px-5 py-4 mb-8">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Safety first:</strong> Never share your exact home address or personal contact details publicly.
              Exchange details privately once you&rsquo;ve found someone to help.
            </p>
          </div>

          {/* Filter tabs — prominent */}
          <div
            className="flex gap-3 mb-10"
            role="group"
            aria-label="Filter by type"
          >
            <Link href="/help">
              <button className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-black border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[48px]',
                !validType
                  ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}>
                All Posts
              </button>
            </Link>
            <Link href="/help?type=need">
              <button className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-black border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[48px]',
                validType === 'need'
                  ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                  : 'bg-white text-muted-foreground border-border hover:border-red-300 hover:text-foreground'
              )}>
                <LifeBuoy size={16} aria-hidden="true" />
                Needs Help
              </button>
            </Link>
            <Link href="/help?type=offer">
              <button className={cn(
                'inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-black border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[48px]',
                validType === 'offer'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                  : 'bg-white text-muted-foreground border-border hover:border-emerald-300 hover:text-foreground'
              )}>
                <HandHeart size={16} aria-hidden="true" />
                Can Help
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Posts */}
      <main className="px-6 pb-40">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-white/40 backdrop-blur-sm rounded-[4rem] border border-border/50 shadow-inner">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-accent shadow-lg">
                <HandHeart size={40} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground mb-4">No posts yet</h2>
              <p className="text-muted-foreground text-xl max-w-sm mb-12 font-medium leading-relaxed">
                Be the first to ask for help or offer support to the {hood.name} community.
              </p>
              <Link href="/help/new">
                <Button size="lg" className="rounded-full font-black px-12 py-8 text-xl hover-bounce shadow-xl shadow-primary/20">
                  Post to the board
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => {
                const isNeed = post.type === 'need'
                return (
                  <article key={post.id} className="group">
                    <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 flex flex-col">
                      <CardContent className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              'text-xs font-bold gap-1.5',
                              isNeed
                                ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50'
                            )}
                            variant="outline"
                          >
                            {isNeed ? (
                              <LifeBuoy size={11} aria-hidden="true" />
                            ) : (
                              <HandHeart size={11} aria-hidden="true" />
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
      </main>
    </div>
  )
}
