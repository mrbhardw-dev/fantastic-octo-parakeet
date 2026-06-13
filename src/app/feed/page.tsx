import Link from 'next/link'
import { PenLine, AlertTriangle, ThumbsUp, Search, CalendarDays, Building2, HelpCircle, HandHeart, LayoutGrid } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/feed/PostCard'
import { getApprovedPosts } from '@/actions/posts'
import { POST_CATEGORIES } from '@/types'
import type { Metadata } from 'next'
import type { PostCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Local Feed',
  description: 'Latest updates, alerts, recommendations, and news from the Kilcock community in Co. Kildare.',
  alternates: { canonical: 'https://baile.fyi/feed' },
}
export const revalidate = 60

const CATEGORY_ICONS: Record<PostCategory, LucideIcon> = {
  Alert: AlertTriangle,
  Recommendation: ThumbsUp,
  'Lost & Found': Search,
  Event: CalendarDays,
  'Local Business': Building2,
  Question: HelpCircle,
  'Community Help': HandHeart,
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function FeedPage({ searchParams }: Props) {
  const { category } = await searchParams
  const validCategory = POST_CATEGORIES.includes(category as PostCategory)
    ? (category as PostCategory)
    : undefined

  const posts = await getApprovedPosts(validCategory)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Updates from Kilcock, Co. Kildare
            {posts.length > 0 && (
              <span className="ml-1">· <span className="font-medium text-foreground">{posts.length}</span> {validCategory ? 'posts' : 'total'}</span>
            )}
          </p>
        </div>
        <Link href="/feed/new">
          <Button className="cursor-pointer gap-2 min-h-[44px]">
            <PenLine size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Post an update</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter by category">
        <Link href="/feed">
          <button
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px] ${
              !validCategory
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            <LayoutGrid size={13} aria-hidden="true" />
            All
          </button>
        </Link>
        {POST_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat]
          const isActive = validCategory === cat
          return (
            <Link key={cat} href={`/feed?category=${encodeURIComponent(cat)}`}>
              <button
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px] ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <Icon size={13} aria-hidden="true" />
                {cat}
              </button>
            </Link>
          )
        })}
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <EmptyState category={validCategory} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ category }: { category?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <PenLine size={28} className="text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        {category ? `No ${category} posts yet` : 'No posts yet'}
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        {category
          ? `Be the first to post something in the ${category} category.`
          : 'Be the first to share something with the Kilcock community.'}
      </p>
      <Link href="/feed/new">
        <Button className="cursor-pointer">Post an update</Button>
      </Link>
    </div>
  )
}
