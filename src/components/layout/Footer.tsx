import Link from 'next/link'
import { Clover, X, Camera } from 'lucide-react'

const sections = [
  {
    label: 'Community',
    links: [
      { href: '/feed',      label: 'Local Feed' },
      { href: '/events',    label: 'Upcoming Events' },
      { href: '/directory', label: 'Business Directory' },
      { href: '/help',      label: 'Neighbour Help' },
    ],
  },
  {
    label: 'Baile',
    links: [
      { href: '/about',      label: 'About Us' },
      { href: '/safety',    label: 'Safety Center' },
      { href: '/index',      label: 'Town Index' },
      { href: '/admin',      label: 'Moderation' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-20 px-6 mt-auto overflow-hidden relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {/* Brand column */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tighter group w-fit">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Clover size={24} className="text-foreground" strokeWidth={2.5} />
            </div>
            <span>baile<span className="text-primary-foreground/40">.fyi</span></span>
          </Link>
          <p className="text-background/60 text-sm leading-relaxed max-w-xs font-medium">
            The community noticeboard for Kilcock, Co. Kildare. Shared home page for residents, businesses, and neighbours.
          </p>
        </div>

        {/* Link columns */}
        {sections.map((section) => (
          <div key={section.label} className="space-y-4">
            <h4 className="font-bold text-background/40 uppercase tracking-widest text-[10px]">
              {section.label}
            </h4>
            <ul className="space-y-3 text-sm font-semibold">
              {section.links.map((link) => (
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
        ))}

        {/* Social / Legal */}
        <div className="space-y-6">
          <h4 className="font-bold text-background/40 uppercase tracking-widest text-[10px]">
            Stay Connected
          </h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-accent hover:text-foreground transition-all">
              <X size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-accent hover:text-foreground transition-all">
              <Camera size={18} />
            </a>
          </div>
          <p className="text-background/40 text-[10px] font-mono uppercase tracking-tighter">
            &copy; {new Date().getFullYear()} BAILE.FYI &middot; KILCOCK, IRELAND
          </p>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-widest text-background/30">
        <Link href="/privacy" className="hover:text-background transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-background transition-colors">Terms</Link>
        <Link href="/contact" className="hover:text-background transition-colors">Contact</Link>
      </div>
    </footer>
  )
}
