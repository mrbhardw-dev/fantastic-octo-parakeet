import { Info, Database, Settings, Eye, ExternalLink, Scale, Clock, RefreshCw } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for baile.fyi — GDPR compliant.',
}

const thirdParties = [
  { name: 'Clerk', desc: 'Handles authentication and identity.', href: 'https://clerk.com/privacy' },
  { name: 'Supabase', desc: 'Stores your data securely on EU servers.', href: 'https://supabase.com/privacy' },
  { name: 'Cloudinary', desc: 'Stores images you upload.', href: 'https://cloudinary.com/privacy' },
  { name: 'Resend', desc: 'Sends transactional emails.', href: 'https://resend.com/privacy' },
]

const gdprRights = [
  'Access the personal data we hold about you',
  'Correct inaccurate data',
  'Request deletion of your account and data',
  'Object to processing',
  'Data portability',
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: June 2025 · Applies to baile.fyi</p>
      </div>

      <div className="space-y-6">
        {/* Who we are */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Info size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Who we are</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>baile.fyi is a community noticeboard for Kilcock, Co. Kildare, Ireland, subject to the EU General Data Protection Regulation (GDPR) and the Irish Data Protection Act 2018.</p>
            <p>For data protection queries, contact us at{' '}
              <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">hello@baile.fyi</a>.
            </p>
          </div>
        </section>

        {/* What we collect */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
              <Database size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">What data we collect</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Account data:</strong> Your name, email address, and profile information when you register.</li>
            <li><strong className="text-foreground">Content:</strong> Posts, events, directory listings, and help board entries you create.</li>
            <li><strong className="text-foreground">Usage data:</strong> Standard server logs (IP address, browser, timestamps) for security purposes.</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            We do <strong className="text-foreground">not</strong> collect your home address. We do not use advertising trackers or third-party analytics beyond Vercel&rsquo;s privacy-respecting analytics.
          </p>
        </section>

        {/* How we use it */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Settings size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">How we use your data</h2>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {[
              'To provide the baile.fyi service and display your public content',
              'To send moderation status emails (approval/rejection of submissions)',
              'To send a one-time welcome email when you register',
              'To prevent abuse and enforce community guidelines',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-primary mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* What's public */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
              <Eye size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">What is publicly visible</h2>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span>Your <strong className="text-foreground">display name</strong> (not your email) appears next to posts you create</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span>Approved posts, events, directory listings, and help entries are publicly visible</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">·</span>Your email address is <strong className="text-foreground">never</strong> shown publicly</li>
          </ul>
        </section>

        {/* Third parties */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
              <ExternalLink size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Third-party services</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {thirdParties.map(({ name, desc, href }) => (
              <div key={name} className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{name}</span>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                    Privacy policy
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GDPR rights */}
        <section className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Scale size={18} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Your rights (GDPR)</h2>
          </div>
          <ul className="space-y-2 mb-4">
            {gdprRights.map((right) => (
              <li key={right} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 mt-1">✓</span>
                {right}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">hello@baile.fyi</a>.
            {' '}We will respond within 30 days.
          </p>
        </section>

        {/* Retention & Changes */}
        <div className="grid sm:grid-cols-2 gap-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                <Clock size={18} aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Data retention</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We retain your account data for as long as your account is active. On deletion requests, personal data is removed within 30 days. Public content may be anonymised rather than deleted.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                <RefreshCw size={18} aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Policy changes</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this policy from time to time. Significant changes will be communicated via the platform. Continued use constitutes acceptance.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
