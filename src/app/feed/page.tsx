import Link from 'next/link'
import { cookies } from 'next/headers'
import { Pencil, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/feed/PostCard'
import { getApprovedPosts } from '@/actions/posts'
import { POST_CATEGORIES } from '@/types'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import type { Metadata } from 'next'
import type { PostCategory } from '@/types'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Local Feed',
  description: 'Latest updates, alerts, recommendations, and news from the Kilcock community.',
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function FeedPage({ searchParams }: Props) {
  const { category } = await searchParams
  const validCategory = POST_CATEGORIES.includes(category as PostCategory)
    ? (category as PostCategory)
    : undefined

  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')

  const posts = await getApprovedPosts(validCategory, 20, 0, undefined, hood.town)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="blob-bg top-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary rounded-full" aria-hidden="true" />
      <div className="blob-bg bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full" aria-hidden="true" />

      <header className="pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              <MapPin size={12} /> {hood.name}, Co. {hood.county}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
              Local <span className="text-primary italic">Feed</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
              Pinned updates, alerts, and stories from your neighbours in the heart of the village.
            </p>
          </div>
          
          <Link href="/feed/new">
            <Button className="group relative inline-flex items-center justify-center gap-3 px-10 py-8 bg-primary text-white font-black rounded-full transition-all hover:scale-105 shadow-2xl shadow-primary/20 text-xl hover-bounce">
              <Pencil size={24} className="transition-transform group-hover:rotate-12" />
              Post an update
            </Button>
          </Link>
        </div>
      </header>

      {/* Sticky Category Filter Bar */}
      <nav className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 py-6 px-6 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <Link href="/feed">
              <button
                className={cn(
                  "whitespace-nowrap px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-sm",
                  !validCategory
                    ? "bg-accent text-accent-foreground scale-105"
                    : "bg-white border border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                )}
              >
                All Notices
              </button>
            </Link>
            {POST_CATEGORIES.map((cat) => {
              const isActive = validCategory === cat
              return (
                <Link key={cat} href={`/feed?category=${encodeURIComponent(cat)}`}>
                  <button
                    className={cn(
                      "whitespace-nowrap px-8 py-3.5 rounded-full font-black text-sm transition-all",
                      isActive
                        ? "bg-accent text-accent-foreground shadow-lg scale-105"
                        : "bg-white border border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="px-6 pb-40">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-white/40 backdrop-blur-sm rounded-[4rem] border border-border/50 shadow-inner">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-primary shadow-lg">
                <Pencil size={40} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground mb-4">
                {validCategory ? `No ${validCategory} posts yet` : 'No posts yet'}
              </h2>
              <p className="text-muted-foreground text-xl max-w-sm mb-12 font-medium leading-relaxed">
                {validCategory
                  ? `Be the first to post something in the ${category} category for ${hood.name}.`
                  : `Be the first to share something with the ${hood.name} community.`}
              </p>
              <Link href="/feed/new">
                <Button size="lg" className="rounded-full font-black px-12 py-8 text-xl hover-bounce shadow-xl shadow-primary/20">
                  Post an update
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post, idx) => (
                <PostCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="mt-32 text-center">
              <Button variant="outline" size="lg" className="rounded-full font-black px-16 py-10 text-2xl border-4 border-primary text-primary hover:bg-secondary transition-all hover:scale-105">
                Browse older notices
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
