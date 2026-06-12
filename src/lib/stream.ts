import 'server-only'
import { StreamClient } from 'getstream'

let _client: StreamClient | null = null

function getStreamClient(): StreamClient {
  if (!_client) {
    _client = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_SECRET!,
    )
  }
  return _client
}

export async function addPostActivity(params: {
  postId: string
  profileId: string
  title: string
  category: string
  town: string
}) {
  const client = getStreamClient()
  const feed = client.feed('timeline', params.town.toLowerCase().replace(/\s+/g, '-'))
  const activity = await feed.addActivity({
    actor: `profile:${params.profileId}`,
    verb: 'post',
    object: `post:${params.postId}`,
    foreign_id: `post:${params.postId}`,
    title: params.title,
    category: params.category,
    town: params.town,
  })
  return activity.id
}

export async function removePostActivity(activityId: string, town: string) {
  const client = getStreamClient()
  const feed = client.feed('timeline', town.toLowerCase().replace(/\s+/g, '-'))
  await feed.removeActivity(activityId)
}

export async function getFeedActivities(town: string, limit = 25, offset = 0) {
  const client = getStreamClient()
  const feed = client.feed('timeline', town.toLowerCase().replace(/\s+/g, '-'))
  const response = await feed.get({ limit, offset })
  return response.results
}
