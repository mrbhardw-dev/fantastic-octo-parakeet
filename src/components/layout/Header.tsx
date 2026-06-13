'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Menu, X, Leaf, Rss, CalendarDays, BookOpen, HandHeart, Shield, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import NeighbourhoodSwitcher from '@/components/NeighbourhoodSwitcher'

const navLinks = [
  { href: '/feed',       label: 'Feed',        Icon: Rss },
  { href: '/events',     label: 'Events',      Icon: CalendarDays },
  { href: '/directory',  label: 'Directory',   Icon: BookOpen },
  { href: '/help',       label: 'Help',        Icon: HandHeart },
  { href: '/guidelines', label: 'Guidelines',  Icon: Shield },
]

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
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

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

          {/* Neighbourhood switcher */}
          <NeighbourhoodSwitcher />

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  pathname.startsWith(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
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
                <Button size="sm" className="cursor-pointer">Join the community</Button>
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
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]',
                  pathname.startsWith(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </Link>
            ))}
            {!isSignedIn && (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full cursor-pointer">Join the community</Button>
                </Link>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full cursor-pointer text-muted-foreground">Already a member? Sign in</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
