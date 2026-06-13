import Link from 'next/link'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import WeatherWidget from '@/components/weather/WeatherWidget'
import { getCommunityStats } from '@/actions/stats'
import { getApprovedPosts } from '@/actions/posts'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import PostCard from '@/components/feed/PostCard'
import {
  MapPin,
  ArrowRight,
  Search,
  Cake,
  CalendarDays,
  Newspaper,
  HeartHandshake,
  ArrowUpRight,
  ChevronRight,
  Home,
  Clover,
  Building2
} from 'lucide-react'

export default async function HomePage() {
  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')
  const { userId } = await auth()

  const [stats, recentPosts] = await Promise.all([
    getCommunityStats(hood.town),
    getApprovedPosts(undefined, 3, 0, undefined, hood.town),
  ])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        {/* Background Decorative Blob */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto relative">
          {/* Floating Notices (Desktop Only) */}
          <div className="hidden lg:block absolute -left-20 top-10 w-64 p-6 bg-white rounded-2xl floating-notice -rotate-6 z-0 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                <Search size={14} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Lost & Found</span>
            </div>
            <p className="text-sm font-bold text-foreground leading-snug">Black Labrador puppy seen near the harbor...</p>
          </div>

          <div className="hidden lg:block absolute -right-10 top-40 w-72 p-6 bg-white rounded-2xl floating-notice rotate-3 z-0 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-accent">
                <Cake size={14} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Local Event</span>
            </div>
            <p className="text-sm font-bold text-foreground leading-snug">Bake Sale tomorrow at the Parish Hall. 10am-2pm.</p>
          </div>

          {/* Main Hero Pill */}
          <div className="relative z-10 hero-pill p-12 md:p-24 text-center max-w-4xl mx-auto overflow-visible">
            {/* Integrated Weather Widget */}
            <WeatherWidget className="absolute -top-6 right-12 hidden md:flex scale-110" />

            <div className="mb-8 flex justify-center items-center gap-3 text-primary/60">
              <MapPin size={16} aria-hidden="true" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">{hood.name}, Co. {hood.county}</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[1]">
              Your home town.<br />
              <span className="text-primary italic">Your home page.</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
              baile /bal-uh/ &middot; Irish for home, place &amp; belonging.<br />
              The community noticeboard for residents, clubs, and neighbours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/feed" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full font-black px-12 py-8 text-xl shadow-xl shadow-primary/20 hover-bounce">
                  Browse local feed
                </Button>
              </Link>
              {userId ? (
                <Link href="/feed/new" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full bg-white border-2 border-primary text-primary rounded-full font-black px-12 py-8 text-xl hover:bg-secondary">
                    Post an update
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full bg-white border-2 border-primary text-primary rounded-full font-black px-12 py-8 text-xl hover:bg-secondary">
                    Join free to post
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Overlapping Circles */}
      <section className="py-28 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale brightness-50" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1775229781684-377f9cdf80ae?auto=format&w=1200&q=80&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
          aria-hidden="true"
        />
        
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:-space-x-12">
            {/* Posts Stat */}
            <div className="w-52 h-52 rounded-full bg-white border-4 border-secondary shadow-2xl flex flex-col items-center justify-center z-10 transform hover:scale-110 transition-transform duration-500">
              <span className="text-5xl font-black text-primary font-mono leading-none tracking-tighter">{stats.posts.toLocaleString()}</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-3">Total Posts</span>
            </div>
            
            {/* Events Stat (Center, Larger) */}
            <div className="w-64 h-64 rounded-full bg-secondary border-4 border-white shadow-2xl flex flex-col items-center justify-center z-20 relative transform hover:scale-105 transition-transform duration-500">
              <div className="absolute -top-4 -right-4 w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white text-2xl animate-pulse shadow-lg">
                <CalendarDays size={28} />
              </div>
              <span className="text-7xl font-black text-primary font-mono leading-none tracking-tighter">{stats.events}</span>
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-3">Live Events</span>
            </div>
            
            {/* Businesses Stat */}
            <div className="w-52 h-52 rounded-full bg-white border-4 border-secondary shadow-2xl flex flex-col items-center justify-center z-10 transform hover:scale-110 transition-transform duration-500">
              <span className="text-5xl font-black text-primary font-mono leading-none tracking-tighter">{stats.businesses}+</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-3">Businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Feed Section */}
      <section className="py-32 bg-secondary/30 border-y border-border px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-foreground">Pinned from the community</h2>
              <p className="text-muted-foreground text-lg font-medium">What your neighbours are talking about today in {hood.name}</p>
            </div>
            <Link href="/feed" className="text-primary text-lg font-black hover:underline underline-offset-8 flex items-center gap-2 group">
              Explore the board <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {recentPosts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore Bento Grid */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black tracking-tighter">Explore {hood.name}</h2>
            <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">Everything you need to stay connected with your village life, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[640px]">
            {/* Community Board (Large Hero Tile) */}
            <Link href="/feed" className="md:col-span-2 bg-secondary/50 rounded-[2.5rem] p-12 border border-primary/5 flex flex-col justify-between hover:bg-secondary hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-[1.25rem] flex items-center justify-center text-primary mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <Newspaper size={36} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter">Community Board</h3>
                <p className="text-foreground/60 text-lg max-w-xs font-medium leading-snug">The pulse of the village. Alerts, news, and daily updates.</p>
              </div>
              <div className="inline-flex items-center gap-3 text-lg font-black text-primary group-hover:gap-5 transition-all relative z-10">
                Enter Board <ArrowUpRight size={24} />
              </div>
            </Link>

            {/* Village Events (Tall Tile) */}
            <Link href="/events" className="md:row-span-2 bg-purple-50 rounded-[2.5rem] p-12 border border-purple-100 flex flex-col justify-between hover:bg-purple-100/50 hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="absolute -right-24 -bottom-24 w-80 h-80 opacity-[0.03] text-purple-900 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <CalendarDays size={320} />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-[1.25rem] flex items-center justify-center text-purple-600 mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <CalendarDays size={36} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter">Village Events</h3>
                <p className="text-foreground/60 text-lg font-medium leading-snug">Festivals, clubs, matches, and markets happening nearby.</p>
              </div>
              <div className="inline-flex items-center gap-3 text-lg font-black text-purple-600 group-hover:gap-5 transition-all relative z-10">
                See Calendar <ArrowUpRight size={24} />
              </div>
            </Link>

            {/* Help Out (Small Tile) */}
            <Link href="/help" className="bg-amber-50 rounded-[2.5rem] p-10 border border-amber-100 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-white rounded-[1rem] flex items-center justify-center text-accent mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <HeartHandshake size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tighter">Help Out</h3>
              <p className="text-sm text-foreground/60 mb-6 font-medium leading-relaxed text-balance">Offer a hand or ask for one from your neighbours.</p>
              <div className="text-sm font-black text-accent flex items-center gap-2 group-hover:gap-3 transition-all">Browse <ChevronRight size={16} /></div>
            </Link>

            {/* Directory (Small Tile) */}
            <Link href="/directory" className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-white rounded-[1rem] flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tighter">Directory</h3>
              <p className="text-sm text-foreground/60 mb-6 font-medium leading-relaxed text-balance">Find local shops, trades, and services in {hood.name}.</p>
              <div className="text-sm font-black text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all">Search <ChevronRight size={16} /></div>
            </Link>

            {/* CTA Tile (Dark, contrasting) */}
            <div className="md:col-span-1 bg-foreground rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center text-background relative overflow-hidden group">
              <div className="z-10 relative">
                <h4 className="font-black text-2xl mb-6 tracking-tighter leading-tight">Your town needs you!</h4>
                <Link href="/sign-up">
                  <Button size="lg" className="rounded-full font-black px-8 py-6 hover-bounce bg-accent text-foreground hover:bg-accent/90 shadow-xl shadow-black/20">
                    Join Baile
                  </Button>
                </Link>
              </div>
              <div className="absolute inset-0 opacity-5 pointer-events-none p-4 flex items-center justify-center group-hover:scale-125 transition-transform duration-1000">
                 <Home size={180} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Join CTA */}
      <section className="py-40 px-4 relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, var(--secondary) 0%, var(--background) 70%)' }} aria-hidden="true" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-12 flex justify-center">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-2xl shadow-accent/30 animate-float text-white border-4 border-white">
              <Home size={48} strokeWidth={2.5} />
            </div>
          </div>
          
          <p className="text-[10px] font-black tracking-[0.5em] uppercase text-primary/60 mb-6">tar abhaile &middot; come home</p>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">Ready to join the village?</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            It's completely free, moderated for safety, and run by residents for residents. No ads, no tracking&mdash;just {hood.name}.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="w-full px-16 py-10 rounded-full font-black text-2xl shadow-2xl shadow-primary/30 hover-bounce">
                Create free account
              </Button>
            </Link>
            <Link href="/feed" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full px-16 py-10 bg-transparent text-foreground border-4 border-foreground/5 rounded-full font-black text-2xl hover:bg-white transition-all">
                Explore as guest
              </Button>
            </Link>
          </div>

          {/* Trust Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left border-t border-border/50 pt-20">
            {[
              { title: 'Moderated', desc: 'Every post is reviewed by local volunteers for safety.' },
              { title: 'Hyper-Local', desc: `Tailored specifically for ${hood.name} residents only.` },
              { title: 'Community Owned', desc: 'For residents, by residents. Zero advertising.' }
            ].map((pillar) => (
              <div key={pillar.title} className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Clover size={28} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-xl tracking-tight">{pillar.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
