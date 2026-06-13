import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  PlusCircle, BookOpen, LayoutGrid, MapPin,
  UtensilsCrossed, ShoppingBag, Wrench, Stethoscope,
  GraduationCap, Trophy, Bus, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DirectoryCard from '@/components/directory/DirectoryCard'
import { getDirectoryListings } from '@/actions/directory'
import { DIRECTORY_CATEGORIES } from '@/types'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import type { DirectoryCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Local Directory',
  description: 'Browse local businesses, tradespeople, clubs, and community groups in Kilcock, Co. Kildare.',
  alternates: { canonical: 'https://baile.fyi/directory' },
}

const DIRECTORY_ICONS: Record<DirectoryCategory, LucideIcon> = {
  'Food & Drink':        UtensilsCrossed,
  'Shops':               ShoppingBag,
  'Trades':              Wrench,
  'Health':              Stethoscope,
  'Schools & Childcare': GraduationCap,
  'Clubs & Sports':      Trophy,
  'Transport':           Bus,
  'Community Groups':    Users,
}

interface Props { searchParams: Promise<{ category?: string }> }

export default async function DirectoryPage({ searchParams }: Props) {
  const { category } = await searchParams
  const validCategory = DIRECTORY_CATEGORIES.includes(category as DirectoryCategory)
    ? (category as DirectoryCategory)
    : undefined

  const cookieStore = await cookies()
  const hood = getNeighbourhood(cookieStore.get(COOKIE_NAME)?.value ?? 'kilcock')

  const listings = await getDirectoryListings(validCategory, 50, hood.town)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blob */}
      <div className="blob-bg top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full" aria-hidden="true" />

      {/* Hero header */}
      <header className="pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6">
            <MapPin size={12} aria-hidden="true" /> {hood.name}, Co. {hood.county}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
                Local <span className="text-blue-600 italic">Directory</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
                Businesses, trades, and community groups in {hood.name}.
                {listings.length > 0 && (
                  <span className="ml-2 font-bold text-foreground">{listings.length} listed</span>
                )}
              </p>
            </div>
            <Link href="/directory/new" className="shrink-0">
              <Button
                size="lg"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-8 font-black rounded-full transition-all hover:scale-105 shadow-2xl shadow-primary/20 text-xl hover-bounce"
              >
                <PlusCircle size={22} className="transition-transform group-hover:rotate-12" aria-hidden="true" />
                Add a listing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Category filter */}
      <div className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div
              className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
              role="group"
              aria-label="Filter by category"
            >
              <Link href="/directory">
                <button
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px]',
                    !validCategory
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  <LayoutGrid size={14} aria-hidden="true" />
                  All
                </button>
              </Link>
              {DIRECTORY_CATEGORIES.map((cat) => {
                const Icon = DIRECTORY_ICONS[cat]
                const isActive = validCategory === cat
                return (
                  <Link key={cat} href={`/directory?category=${encodeURIComponent(cat)}`}>
                    <button
                      className={cn(
                        'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[40px]',
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      <Icon size={14} aria-hidden="true" />
                      {cat}
                    </button>
                  </Link>
                )
              })}
            </div>
            {/* Scroll-fade hint on mobile */}
            <div className="md:hidden absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Listings */}
      <main className="px-6 pb-40">
        <div className="max-w-6xl mx-auto">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center bg-white/40 backdrop-blur-sm rounded-[4rem] border border-border/50 shadow-inner">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-lg">
                <BookOpen size={40} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground mb-4">
                {validCategory ? `No ${validCategory} listings yet` : 'No listings yet'}
              </h2>
              <p className="text-muted-foreground text-xl max-w-sm mb-12 font-medium leading-relaxed">
                Be the first to add a local business or service to the {hood.name} directory.
              </p>
              <Link href="/directory/new">
                <Button size="lg" className="rounded-full font-black px-12 py-8 text-xl hover-bounce shadow-xl shadow-primary/20">
                  Add a listing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <DirectoryCard key={listing.id} listing={listing} showReport={false} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
