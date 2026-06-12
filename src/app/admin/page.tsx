import Link from 'next/link'
import { getPendingCounts } from '@/actions/admin'
import { Card, CardContent } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const counts = await getPendingCounts()

  const sections = [
    { label: 'Pending Posts', count: counts.posts, href: '/admin/posts' },
    { label: 'Pending Events', count: counts.events, href: '/admin/events' },
    { label: 'Pending Listings', count: counts.listings, href: '/admin/directory' },
    { label: 'Pending Help Posts', count: counts.helpPosts, href: '/admin/help' },
    { label: 'Reports', count: counts.reports, href: '/admin/reports' },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pending review</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
            <Card className="h-full transition-all duration-150 hover:shadow-md hover:border-primary/30">
              <CardContent className="p-5 text-center">
                <span className={`text-3xl font-bold block mb-1 ${s.count > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.count}
                </span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
