import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for baile.fyi — GDPR compliant.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: June 2025</p>

      <div className="space-y-8 text-foreground">
        <section>
          <h2 className="text-xl font-semibold mb-3">Who we are</h2>
          <p className="text-muted-foreground leading-relaxed">
            baile.fyi is a community noticeboard for Kilcock, Co. Kildare, Ireland.
            We are subject to the EU General Data Protection Regulation (GDPR) and the
            Irish Data Protection Act 2018.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            For data protection queries, contact us at{' '}
            <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer">hello@baile.fyi</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What data we collect</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong>Account data:</strong> Your name, email address, and profile information when you register.</li>
            <li><strong>Content:</strong> Posts, events, directory listings, and help board entries you create.</li>
            <li><strong>Usage data:</strong> Standard server logs (IP address, browser, timestamps) for security purposes.</li>
          </ul>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            We do <strong>not</strong> collect your home address. Eircode is not collected at this time.
            We do not use advertising trackers or third-party analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How we use your data</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>To provide the baile.fyi service and display your public content</li>
            <li>To send you moderation status emails (approval/rejection of your submissions)</li>
            <li>To send a one-time welcome email when you register</li>
            <li>To prevent abuse and enforce our community guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What is publicly visible</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Your <strong>display name</strong> (not your email address) appears next to posts you create</li>
            <li>Approved posts, events, directory listings, and help board entries are publicly visible</li>
            <li>Your email address is never shown publicly</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Third-party services</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong>Clerk</strong> — handles authentication and identity. <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline cursor-pointer">Privacy policy</a></li>
            <li><strong>Supabase</strong> — stores your data securely on EU servers. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline cursor-pointer">Privacy policy</a></li>
            <li><strong>Cloudinary</strong> — stores images you upload. <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline cursor-pointer">Privacy policy</a></li>
            <li><strong>Resend</strong> — sends transactional emails. <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline cursor-pointer">Privacy policy</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your rights (GDPR)</h2>
          <p className="text-muted-foreground leading-relaxed">Under the GDPR, you have the right to:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground list-disc pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Object to processing</li>
            <li>Data portability</li>
          </ul>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer">hello@baile.fyi</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your account data for as long as your account is active.
            If you request deletion, we will remove your personal data within 30 days.
            Public content may be anonymised rather than deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Changes to this policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this policy from time to time. Significant changes will be communicated
            via the platform. Continued use of baile.fyi constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  )
}
