import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  PlusCircle, BookOpen, LayoutGrid,
  UtensilsCrossed, ShoppingBag, Wrench, Stethoscope,
  GraduationCap, Trophy, Bus, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DirectoryCard from '@/components/directory/DirectoryCard'
import { getDirectoryListings } from '@/actions/directory'
import { DIRECTORY_CATEGORIES } from '@/types'
import { getNeighbourhood, COOKIE_NAME } from '@/lib/neighbourhoods'
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Businesses, trades, and community groups in {hood.name}
            {listings.length > 0 && (
              <span className="ml-1">· <span className="font-medium text-foreground">{listings.length}</span> listed</span>
            )}
          </p>
        </div>
        <Link href="/directory/new">
          <Button className="cursor-pointer gap-2 min-h-[44px]">
            <PlusCircle size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Add a listing</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter by category">
        <Link href="/directory">
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
        {DIRECTORY_CATEGORIES.map((cat) => {
          const Icon = DIRECTORY_ICONS[cat]
          const isActive = validCategory === cat
          return (
            <Link key={cat} href={`/directory?category=${encodeURIComponent(cat)}`}>
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

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BookOpen size={28} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            {validCategory ? `No ${validCategory} listings yet` : 'No listings yet'}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Be the first to add a local business or service to the {hood.name} directory.
          </p>
          <Link href="/directory/new"><Button className="cursor-pointer">Add a listing</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <DirectoryCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
