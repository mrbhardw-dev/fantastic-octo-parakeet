import 'server-only'
import { algoliasearch } from 'algoliasearch'

const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!,
)

export const INDICES = {
  posts: 'baile_posts',
  events: 'baile_events',
  directory: 'baile_directory',
} as const

export async function indexPost(post: {
  id: string
  title: string
  body: string
  category: string
  town: string
  county: string
  created_at: string
}) {
  await adminClient.saveObject({
    indexName: INDICES.posts,
    body: { objectID: post.id, ...post },
  })
}

export async function indexEvent(event: {
  id: string
  title: string
  description?: string | null
  town: string
  county: string
  starts_at: string
}) {
  await adminClient.saveObject({
    indexName: INDICES.events,
    body: { objectID: event.id, ...event },
  })
}

export async function indexDirectoryListing(listing: {
  id: string
  name: string
  category: string
  description?: string | null
  town: string
  county: string
}) {
  await adminClient.saveObject({
    indexName: INDICES.directory,
    body: { objectID: listing.id, ...listing },
  })
}

export async function removeFromIndex(indexName: string, objectId: string) {
  await adminClient.deleteObject({ indexName, objectID: objectId })
}
