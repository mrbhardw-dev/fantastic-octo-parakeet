import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description: 'Community guidelines for baile.fyi — Kilcock\'s local community noticeboard.',
}

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Community Guidelines</h1>
      <p className="text-muted-foreground mb-8">Last updated: June 2025</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-foreground">
        <section>
          <h2 className="text-xl font-semibold mb-3">Our community values</h2>
          <p className="text-muted-foreground leading-relaxed">
            baile.fyi is a community platform for the residents, businesses, and organisations of Kilcock,
            Co. Kildare. We exist to help neighbours connect, share local information, and support each other.
            These guidelines help us keep the platform safe, respectful, and useful for everyone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What we encourage</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Sharing local news, alerts, and updates that are relevant to Kilcock</li>
            <li>Promoting local events, businesses, clubs, and community initiatives</li>
            <li>Helping neighbours find lost pets, property, or information</li>
            <li>Offering or asking for community help in a respectful way</li>
            <li>Constructive questions about local services, roads, or planning</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What is not allowed</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li><strong>Hate speech:</strong> No content targeting people based on race, religion, gender, sexuality, disability, or nationality.</li>
            <li><strong>Harassment:</strong> No personal attacks, threats, or targeted abuse of individuals.</li>
            <li><strong>Misinformation:</strong> Do not knowingly share false or misleading information.</li>
            <li><strong>Spam and advertising:</strong> No unsolicited commercial content. Businesses should use the directory.</li>
            <li><strong>Privacy violations:</strong> Do not share another person&rsquo;s private information without their consent.</li>
            <li><strong>Illegal content:</strong> Nothing that promotes or facilitates illegal activity under Irish law.</li>
            <li><strong>Off-topic content:</strong> Posts should be relevant to Kilcock and the surrounding community.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Safety guidance</h2>
          <p className="text-muted-foreground leading-relaxed">
            When using the Neighbour Help Board, never share your full home address publicly.
            If you arrange to meet someone through the platform, meet in a public place first.
            If you see something that concerns you, use the Report button on any post.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Moderation</h2>
          <p className="text-muted-foreground leading-relaxed">
            All posts on baile.fyi are reviewed by a volunteer moderator before appearing publicly.
            This typically takes less than 24 hours. Content that violates these guidelines will be
            rejected. Repeat violations may result in account suspension.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            If you believe content has been incorrectly removed or approved, please contact us at{' '}
            <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer">hello@baile.fyi</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For any issues, concerns, or feedback about the platform, please email{' '}
            <a href="mailto:hello@baile.fyi" className="text-primary hover:underline cursor-pointer">hello@baile.fyi</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
