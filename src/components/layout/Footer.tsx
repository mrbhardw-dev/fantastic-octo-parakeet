import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
              <Leaf size={12} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-foreground">
              baile<span className="text-primary">.fyi</span>
            </span>
            <span className="text-sm text-muted-foreground">· Kilcock, Co. Kildare</span>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href="/guidelines" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              Community Guidelines
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              Privacy Policy
            </Link>
            <Link href="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              Local Feed
            </Link>
            <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              Events
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} baile.fyi · Built for the community of Kilcock, Co. Kildare, Ireland.
        </p>
      </div>
    </footer>
  )
}
