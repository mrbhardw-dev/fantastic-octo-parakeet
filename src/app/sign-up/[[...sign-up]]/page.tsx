import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Leaf, Check } from 'lucide-react'
import { getCommunityStats } from '@/actions/stats'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Join baile.fyi — Kilcock\'s community noticeboard' }

const benefits = [
  'Post local news, alerts, and community updates',
  'List your business in the Kilcock directory',
  'Add events and discover what\'s on locally',
  'Ask for help or offer support to neighbours',
  'Free forever — no ads, no tracking, no nonsense',
]

export default async function SignUpPage() {
  const stats = await getCommunityStats()

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: brand panel */}
      <div className="lg:w-[460px] shrink-0 bg-primary text-primary-foreground p-8 lg:p-12 flex flex-col justify-center">
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

          <h1 className="text-2xl font-bold mb-3 leading-snug">
            Join Kilcock&rsquo;s community noticeboard
          </h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed mb-8">
            Free to join. Connect with residents, discover local events,
            and share what matters in Kilcock, Co. Kildare.
          </p>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-3 mb-8 rounded-xl bg-primary-foreground/10 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums">{stats.posts}</p>
              <p className="text-[11px] text-primary-foreground/65 mt-0.5">Posts</p>
            </div>
            <div className="text-center border-x border-primary-foreground/20">
              <p className="text-2xl font-bold tabular-nums">{stats.events}</p>
              <p className="text-[11px] text-primary-foreground/65 mt-0.5">Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums">{stats.businesses}</p>
              <p className="text-[11px] text-primary-foreground/65 mt-0.5">Businesses</p>
            </div>
          </div>

          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-primary-foreground/85">
                <Check size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Clerk form */}
      <div className="flex-1 flex items-center justify-center p-8 py-12 bg-background">
        <SignUp routing="path" path="/sign-up" />
      </div>
    </div>
  )
}
