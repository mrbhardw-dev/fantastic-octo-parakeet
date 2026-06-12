'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Menu, X, Leaf } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/feed', label: 'Feed' },
  { href: '/events', label: 'Events' },
  { href: '/directory', label: 'Directory' },
  { href: '/help', label: 'Help' },
  { href: '/guidelines', label: 'Guidelines' },
]

export default function Header() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="baile.fyi home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
              <Leaf size={16} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              baile<span className="text-primary">.fyi</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  pathname.startsWith(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="cursor-pointer hidden sm:inline-flex">Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="cursor-pointer hidden sm:inline-flex">Join</Button>
                </Link>
              </>
            ) : (
              <UserButton />
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-border bg-card">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] flex items-center',
                  pathname.startsWith(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isSignedIn && (
              <div className="flex gap-2 pt-2">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full cursor-pointer">Sign in</Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full cursor-pointer">Join</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
