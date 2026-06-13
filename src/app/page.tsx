import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import WeatherWidget from '@/components/weather/WeatherWidget'
import { getCommunityStats } from '@/actions/stats'
import { getApprovedPosts } from '@/actions/posts'
import { CATEGORY_COLORS } from '@/types'
import {
  Rss,
  CalendarDays,
  BookOpen,
  HandHeart,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  PenLine,
  Clock,
  MessageSquare,
  Building2,
} from 'lucide-react'

export const revalidate = 300

export default async function HomePage() {
  const [stats, recentPosts] = await Promise.all([
    getCommunityStats(),
    getApprovedPosts(undefined, 3),
  ])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/40 to-background py-20 px-4 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <MapPin size={14} aria-hidden="true" />
            Now serving Kilcock, Co. Kildare
          </div>
          <div className="mb-6 flex justify-center">
            <WeatherWidget />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your town,<br />
            <span className="text-primary">your community</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
            baile.fyi is Kilcock&rsquo;s local community noticeboard — a place for residents,
            businesses, clubs, and neighbours to share what matters in your town.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/feed">
              <Button size="lg" className="cursor-pointer gap-2 min-h-[44px] shadow-md">
                <Rss size={18} aria-hidden="true" />
                Browse local feed
              </Button>
            </Link>
            <Link href="/feed/new">
              <Button size="lg" variant="outline" className="cursor-pointer gap-2 min-h-[44px]">
                <PenLine size={18} aria-hidden="true" />
                Post an update
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="cursor-pointer gap-2 min-h-[44px]">
                <CalendarDays size={18} aria-hidden="true" />
                See events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Activity stats strip */}
      <section className="border-y border-border bg-muted/30 py-5 px-4" aria-label="Community activity">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare size={16} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums leading-none">{stats.posts}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Community posts</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <CalendarDays size={16} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums leading-none">{stats.events}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Upcoming events</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Building2 size={16} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums leading-none">{stats.businesses}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Local businesses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest from the community */}
      {recentPosts.length > 0 && (
        <section className="py-14 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-xl font-bold text-foreground">Latest from the community</h2>
                <p className="text-sm text-muted-foreground mt-1">What your neighbours are sharing right now</p>
              </div>
              <Link
                href="/feed"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                See all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentPosts.map((post) => {
                const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-800'
                const ago = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                return (
                  <Link
                    key={post.id}
                    href={`/feed/${post.id}`}
                    className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                  >
                    <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary/40 group-hover:-translate-y-0.5">
                      <CardContent className="p-4 flex flex-col h-full">
                        <Badge className={`${colorClass} border text-xs font-medium mb-3 self-start`} variant="outline">
                          {post.category}
                        </Badge>
                        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-150 mb-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                          {post.body}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                          <Clock size={10} aria-hidden="true" />
                          {ago}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className={`py-16 px-4 ${recentPosts.length > 0 ? 'bg-muted/20' : ''}`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-3">
            Everything happening in Kilcock
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
            One place for local news, events, businesses, and community support.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
                <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary/40 group-hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.bgColor} ${f.textColor}`}>
                      <f.icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      Browse <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trust.map((t) => (
              <div key={t.title} className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <t.icon size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Join your community today</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
            It&rsquo;s free to join. Sign up to post updates, add events, and connect
            with the people of Kilcock.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="cursor-pointer min-h-[44px] font-semibold">
                Create a free account
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="cursor-pointer min-h-[44px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Browse without signing in
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

const features = [
  {
    href: '/feed',
    icon: Rss,
    title: 'Local Feed',
    description: 'Alerts, recommendations, lost & found, and news from your neighbours in Kilcock.',
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
  },
  {
    href: '/events',
    icon: CalendarDays,
    title: 'Events',
    description: "Discover and share what's happening in Kilcock and the surrounding area.",
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    href: '/directory',
    icon: BookOpen,
    title: 'Local Directory',
    description: 'Browse local businesses, tradespeople, clubs, and community groups.',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    href: '/help',
    icon: HandHeart,
    title: 'Neighbour Help',
    description: 'Ask for help or offer a hand to someone in your community.',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
]

const trust = [
  {
    icon: ShieldCheck,
    title: 'Moderated content',
    description: 'All posts are reviewed before publishing to keep the community safe and relevant.',
  },
  {
    icon: MapPin,
    title: 'Built for your area',
    description: 'Each community gets its own noticeboard. Starting with Kilcock — more Irish towns joining soon.',
  },
  {
    icon: Users,
    title: 'Community-run',
    description: 'For residents, by residents. No advertising, no tracking, no nonsense.',
  },
]
