import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'baile.fyi — Kilcock\'s community noticeboard', template: '%s | baile.fyi' },
  description: 'The local community noticeboard for Kilcock, Co. Kildare. Share updates, find events, browse local businesses, and connect with your neighbours.',
  metadataBase: new URL('https://baile.fyi'),
  keywords: ['Kilcock', 'Kildare', 'community noticeboard', 'local news', 'events', 'local directory', 'Ireland', 'neighbours', 'Leinster', 'Co Kildare'],
  authors: [{ name: 'baile.fyi', url: 'https://baile.fyi' }],
  creator: 'baile.fyi',
  robots: { index: true, follow: true },
  openGraph: {
    siteName: 'baile.fyi',
    locale: 'en_IE',
    type: 'website',
    url: 'https://baile.fyi',
  },
  twitter: {
    card: 'summary',
    site: '@bailefyi',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IE" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <ClerkProvider>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors />
            <Analytics />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
