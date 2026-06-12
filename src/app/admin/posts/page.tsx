import { getPendingItems, moderatePost } from '@/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ModerateButtons from '@/components/admin/ModerateButtons'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Posts' }
export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const posts = await getPendingItems('post') as Array<{
    id: string; title: string; body: string; category: string;
    created_at: string; profiles: { display_name: string } | null
  }>

  if (posts.length === 0) {
    return <p className="text-muted-foreground text-sm">No posts pending review.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Posts pending review ({posts.length})</h2>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs shrink-0">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    by {post.profiles?.display_name ?? 'Unknown'} &middot;{' '}
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.body}</p>
              </div>
            </div>
            <ModerateButtons
              contentId={post.id}
              contentType="post"
              onApprove={async (id) => { 'use server'; return moderatePost(id, 'approved') }}
              onReject={async (id, reason) => { 'use server'; return moderatePost(id, 'rejected', reason) }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
