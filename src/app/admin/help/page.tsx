import { getPendingItems, moderateHelpPost } from '@/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ModerateButtons from '@/components/admin/ModerateButtons'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Help Posts' }
export const dynamic = 'force-dynamic'

export default async function AdminHelpPage() {
  const posts = await getPendingItems('help_post') as Array<{
    id: string; title: string; body: string; type: string;
    created_at: string; profiles: { display_name: string } | null
  }>

  if (posts.length === 0) {
    return <p className="text-muted-foreground text-sm">No help posts pending review.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Help posts pending review ({posts.length})</h2>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-5">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={post.type === 'need' ? 'destructive' : 'default'} className={`text-xs ${post.type === 'offer' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
                  {post.type === 'need' ? 'Needs help' : 'Can help'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  by {post.profiles?.display_name ?? 'Unknown'} &middot;{' '}
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
              <h3 className="font-medium text-foreground">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.body}</p>
            </div>
            <ModerateButtons
              contentId={post.id}
              contentType="help_post"
              onApprove={async (id) => { 'use server'; return moderateHelpPost(id, 'approved') }}
              onReject={async (id, reason) => { 'use server'; return moderateHelpPost(id, 'rejected', reason) }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
