import Link from 'next/link'
import { Leaf } from 'lucide-react'

const sections = [
  {
    label: 'Community',
    links: [
      { href: '/feed',      label: 'Local Feed' },
      { href: '/events',    label: 'Events' },
      { href: '/directory', label: 'Directory' },
      { href: '/help',      label: 'Neighbour Help' },
    ],
  },
  {
    label: 'Get involved',
    links: [
      { href: '/feed/new',      label: 'Post an update' },
      { href: '/events/new',    label: 'Add an event' },
      { href: '/directory/new', label: 'List a business' },
      { href: '/sign-up',       label: 'Create an account' },
    ],
  },
  {
    label: 'About',
    links: [
      { href: '/guidelines', label: 'Community Guidelines' },
      { href: '/privacy',    label: 'Privacy Policy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md w-fit">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
                <Leaf size={13} strokeWidth={2.5} />
              </span>
              <span className="text-base font-bold text-foreground">
                baile<span className="text-primary">.fyi</span>
              </span>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground/60 font-medium tracking-widest uppercase">
              baile /bal-uh/ · Irish for home
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground leading-snug">
              Your home town.<br />Your home page.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Kilcock, Co. Kildare, Ireland</p>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.label}>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                {section.label}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} baile.fyi · Built for the community of Kilcock, Ireland.
          </p>
          <p className="text-xs text-muted-foreground">
            No advertising · No tracking · No nonsense
          </p>
        </div>
      </div>
    </footer>
  )
}
