import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Rss,
  CalendarDays,
  BookOpen,
  HandHeart,
  MapPin,
  ShieldCheck,
  Users,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-secondary/30 to-background py-20 px-4 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <MapPin size={14} aria-hidden="true" />
            Kilcock, Co. Kildare — Phase 1
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
              <Button size="lg" className="cursor-pointer gap-2 min-h-[44px]">
                <Rss size={18} aria-hidden="true" />
                View local feed
              </Button>
            </Link>
            <Link href="/feed/new">
              <Button size="lg" variant="outline" className="cursor-pointer gap-2 min-h-[44px]">
                <MessageSquare size={18} aria-hidden="true" />
                Post an update
              </Button>
            </Link>
            <Link href="/events/new">
              <Button size="lg" variant="outline" className="cursor-pointer gap-2 min-h-[44px]">
                <CalendarDays size={18} aria-hidden="true" />
                Add an event
              </Button>
            </Link>
            <Link href="/directory/new">
              <Button size="lg" variant="outline" className="cursor-pointer gap-2 min-h-[44px]">
                <BookOpen size={18} aria-hidden="true" />
                List a local service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
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
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
  },
  {
    href: '/events',
    icon: CalendarDays,
    title: 'Events',
    description: 'Discover and share what\'s happening in Kilcock and the surrounding area.',
  },
  {
    href: '/directory',
    icon: BookOpen,
    title: 'Local Directory',
    description: 'Browse local businesses, tradespeople, clubs, and community groups.',
  },
  {
    href: '/help',
    icon: HandHeart,
    title: 'Neighbour Help',
    description: 'Ask for help or offer a hand to someone in your community.',
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
    title: 'Kilcock-focused',
    description: 'Built specifically for Kilcock, Co. Kildare. More Irish towns coming soon.',
  },
  {
    icon: Users,
    title: 'Community-run',
    description: 'For residents, by residents. No advertising, no tracking, no nonsense.',
  },
]
