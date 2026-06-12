import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Separator } from '@/components/ui/separator'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile || !['admin', 'moderator'].includes(profile.role)) {
    redirect('/')
  }

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/posts', label: 'Posts' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/directory', label: 'Directory' },
    { href: '/admin/help', label: 'Help Posts' },
    { href: '/admin/reports', label: 'Reports' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Moderation Dashboard</p>
        <h1 className="text-xl font-bold text-foreground">baile.fyi Admin</h1>
        <p className="text-sm text-muted-foreground">Signed in as {profile.display_name} ({profile.role})</p>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-wrap gap-1 mb-6">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[36px] flex items-center"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Separator className="mb-6" />
      {children}
    </div>
  )
}
