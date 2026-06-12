import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReportButton from '@/components/feed/ReportButton'
import { CATEGORY_COLORS } from '@/types'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  showReport?: boolean
}

export default function PostCard({ post, showReport = true }: PostCardProps) {
  const ago = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-800'

  return (
    <article className="group">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30">
        {post.image_url && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Badge className={`${colorClass} border text-xs font-medium shrink-0`} variant="outline">
              {post.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <MapPin size={11} aria-hidden="true" />
              {post.town}
            </div>
          </div>

          <Link
            href={`/feed/${post.id}`}
            className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <h2 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-150">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
            {post.body}
          </p>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              {post.profiles?.display_name && (
                <span className="font-medium text-foreground">{post.profiles.display_name}</span>
              )}{' '}
              <span>{ago}</span>
            </div>
            {showReport && <ReportButton contentId={post.id} contentType="post" />}
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
