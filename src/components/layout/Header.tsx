'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Menu, X, Clover, Rss, CalendarDays, BookOpen, HandHeart, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import NeighbourhoodSwitcher from '@/components/NeighbourhoodSwitcher'

const navLinks = [
  { href: '/feed',       label: 'Feed',       Icon: Rss },
  { href: '/events',     label: 'Events',     Icon: CalendarDays },
  { href: '/directory',  label: 'Directory',  Icon: BookOpen },
  { href: '/help',       label: 'Help',       Icon: HandHeart },
]

const AUTH_ROUTES = ['/sign-in', '/sign-up']

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9 w-9" />
  return (
    <button
      type="button"
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) return null

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md group"
            aria-label="baile.fyi home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:rotate-3 transition-transform" aria-hidden="true">
              <Clover size={20} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold tracking-tighter text-foreground">
              baile<span className="text-primary">.fyi</span>
            </span>
          </Link>

          {/* Neighbourhood switcher */}
          <NeighbourhoodSwitcher />

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  pathname.startsWith(href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                )}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth + theme */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isSignedIn ? (
              <Link href="/sign-up" className="hidden sm:inline-flex">
                <Button size="sm" className="rounded-full font-bold cursor-pointer hover-bounce">Join Village</Button>
              </Link>
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
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-2">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer min-h-[48px]',
                  pathname.startsWith(href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                )}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            ))}
            {!isSignedIn && (
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  <Button size="lg" className="w-full rounded-xl font-bold cursor-pointer">Join the community</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
