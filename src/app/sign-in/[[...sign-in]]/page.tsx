import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Leaf, Rss, CalendarDays, HandHeart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign in — baile.fyi' }

const highlights = [
  { icon: Rss,          text: 'Follow the local feed' },
  { icon: CalendarDays, text: 'Add and discover events' },
  { icon: HandHeart,    text: 'Give or get neighbour help' },
]

export default function SignInPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row">
      {/* Left: brand panel */}
      <div className="lg:w-[400px] shrink-0 bg-primary text-primary-foreground p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto lg:mx-0 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60 rounded-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
              <Leaf size={18} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              baile<span className="opacity-60">.fyi</span>
            </span>
          </Link>

          <p className="text-primary-foreground/50 text-[10px] font-medium tracking-[0.2em] uppercase mb-3">
            tar abhaile · come home
          </p>
          <h1 className="text-2xl font-bold mb-3 leading-snug">Welcome back home</h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed mb-8">
            Sign in to post updates, add events, and connect with the people of Kilcock, Co. Kildare.
          </p>

          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-primary-foreground/85">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <Icon size={15} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs text-primary-foreground/50">
            New here?{' '}
            <Link href="/sign-up" className="underline underline-offset-2 hover:text-primary-foreground/80 cursor-pointer">
              Create a free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Clerk form */}
      <div className="flex-1 flex items-center justify-center p-8 py-12 bg-background">
        <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/api/auth/sync" />
      </div>
    </div>
  )
}
