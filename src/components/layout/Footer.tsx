'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clover, Shield } from 'lucide-react'

const AUTH_ROUTES = ['/sign-in', '/sign-up']

const communityLinks = [
  { href: '/feed',       label: 'Local Feed' },
  { href: '/events',     label: 'Upcoming Events' },
  { href: '/directory',  label: 'Business Directory' },
  { href: '/help',       label: 'Neighbour Help' },
]

const legalLinks = [
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/privacy',    label: 'Privacy' },
]

export default function Footer() {
  const pathname = usePathname()
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) return null

  return (
    <footer className="bg-foreground text-background py-16 px-6 mt-auto overflow-hidden relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Brand column */}
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-black tracking-tighter group w-fit">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Clover size={20} className="text-foreground" strokeWidth={2.5} />
            </div>
            <span>baile<span className="text-background/40">.fyi</span></span>
          </Link>
          <p className="text-background/60 text-sm leading-relaxed max-w-xs font-medium">
            The community noticeboard for Kilcock, Co. Kildare. Shared home page for residents, businesses, and neighbours.
          </p>
          <p className="text-background/30 text-[10px] font-mono uppercase tracking-tighter">
            &copy; {new Date().getFullYear()} BAILE.FYI &middot; KILCOCK, IRELAND
          </p>
        </div>

        {/* Community links */}
        <div className="space-y-4">
          <h4 className="font-bold text-background/40 uppercase tracking-widest text-[10px]">Community</h4>
          <ul className="space-y-3 text-sm font-semibold">
            {communityLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-background/80 hover:text-accent transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + social */}
        <div className="space-y-4">
          <h4 className="font-bold text-background/40 uppercase tracking-widest text-[10px]">Legal &amp; Info</h4>
          <ul className="space-y-3 text-sm font-semibold">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-background/80 hover:text-accent transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-2 flex items-center gap-2">
            <Shield size={13} className="text-background/30" />
            <span className="text-[10px] text-background/30 font-medium">Moderated for safety</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-background/30">
        <span>Made with ❤ in Kildare</span>
        <Link href="/guidelines" className="hover:text-background/60 transition-colors">Community guidelines</Link>
        <Link href="/privacy" className="hover:text-background/60 transition-colors">Privacy</Link>
      </div>
    </footer>
  )
}
