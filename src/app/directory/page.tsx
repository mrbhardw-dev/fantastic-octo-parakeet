import Link from 'next/link'
import { PlusCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DirectoryCard from '@/components/directory/DirectoryCard'
import { getDirectoryListings } from '@/actions/directory'
import { DIRECTORY_CATEGORIES } from '@/types'
import type { Metadata } from 'next'
import type { DirectoryCategory } from '@/types'

export const metadata: Metadata = { title: 'Local Directory' }
export const revalidate = 300

interface Props { searchParams: Promise<{ category?: string }> }

export default async function DirectoryPage({ searchParams }: Props) {
  const { category } = await searchParams
  const validCategory = DIRECTORY_CATEGORIES.includes(category as DirectoryCategory)
    ? (category as DirectoryCategory)
    : undefined

  const listings = await getDirectoryListings(validCategory)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Businesses, trades, and community groups in Kilcock</p>
        </div>
        <Link href="/directory/new">
          <Button className="cursor-pointer gap-2 min-h-[44px]">
            <PlusCircle size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Add a listing</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label="Filter by category">
        <Link href="/directory">
          <Button variant={!validCategory ? 'default' : 'outline'} size="sm" className="cursor-pointer min-h-[36px]">All</Button>
        </Link>
        {DIRECTORY_CATEGORIES.map((cat) => (
          <Link key={cat} href={`/directory?category=${encodeURIComponent(cat)}`}>
            <Button variant={validCategory === cat ? 'default' : 'outline'} size="sm" className="cursor-pointer min-h-[36px]">
              {cat}
            </Button>
          </Link>
        ))}
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
            Be the first to add a local business or service to the directory.
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
