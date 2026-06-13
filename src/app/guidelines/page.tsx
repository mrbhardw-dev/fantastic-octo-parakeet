import { Check, X, Shield, AlertTriangle, Heart, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description: "Community guidelines for baile.fyi — Kilcock's local community noticeboard.",
}

const encouraged = [
  'Sharing local news, alerts, and updates relevant to Kilcock',
  'Promoting local events, businesses, clubs, and community initiatives',
  'Helping neighbours find lost pets, property, or information',
  'Offering or asking for community help in a respectful way',
  'Constructive questions about local services, roads, or planning',
]

const notAllowed = [
  { label: 'Hate speech', detail: 'No content targeting people based on race, religion, gender, sexuality, disability, or nationality.' },
  { label: 'Harassment', detail: 'No personal attacks, threats, or targeted abuse of individuals.' },
  { label: 'Misinformation', detail: 'Do not knowingly share false or misleading information.' },
  { label: 'Spam and advertising', detail: 'No unsolicited commercial content. Businesses should use the directory.' },
  { label: 'Privacy violations', detail: "Do not share another person's private information without their consent." },
  { label: 'Illegal content', detail: 'Nothing that promotes or facilitates illegal activity under Irish law.' },
  { label: 'Off-topic content', detail: 'Posts should be relevant to Kilcock and the surrounding community.' },
]

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Shield size={14} aria-hidden="true" />
          Community standards
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Guidelines</h1>
        <p className="text-muted-foreground">Last updated: June 2025</p>
      </div>

      <div className="space-y-8">
        {/* Values intro */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Heart size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Our community values</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            baile.fyi is a community platform for the residents, businesses, and organisations of Kilcock, Co. Kildare.
            We exist to help neighbours connect, share local information, and support each other. These guidelines
            help us keep the platform safe, respectful, and useful for everyone.
          </p>
        </section>

        {/* What we encourage */}
        <section className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Check size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">What we encourage</h2>
          </div>
          <ul className="space-y-2.5">
            {encouraged.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What's not allowed */}
        <section className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 shrink-0">
              <X size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">What is not allowed</h2>
          </div>
          <ul className="space-y-3.5">
            {notAllowed.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <X size={14} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{item.label}:</strong>{' '}{item.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Safety */}
        <section className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shrink-0">
              <AlertTriangle size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Safety guidance</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When using the Neighbour Help Board, never share your full home address publicly.
            If you arrange to meet someone through the platform, meet in a public place first.
            If you see something that concerns you, use the Report button on any post.
          </p>
        </section>

        {/* Moderation */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Shield size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Moderation</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              All posts on baile.fyi are reviewed by a volunteer moderator before appearing publicly.
              This typically takes less than 24 hours. Content that violates these guidelines will be rejected.
              Repeat violations may result in account suspension.
            </p>
            <p>
              If you believe content has been incorrectly removed or approved, please contact us at{' '}
              <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                hello@baile.fyi
              </a>.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
              <Mail size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Contact us</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any issues, concerns, or feedback about the platform, please email{' '}
            <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              hello@baile.fyi
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
