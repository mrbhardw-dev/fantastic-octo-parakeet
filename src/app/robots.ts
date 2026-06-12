import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: 'https://baile.fyi/sitemap.xml',
  }
}
