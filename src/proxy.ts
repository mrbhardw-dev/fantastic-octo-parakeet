import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/feed/new(.*)',
  '/events/new(.*)',
  '/directory/new(.*)',
  '/help/new(.*)',
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jte?|tiff?|bmp|gif|png|jpe?g|ico|webp|avif|svg|ttf|woff2?|mp4|webm|woff|eot|otf)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
}
