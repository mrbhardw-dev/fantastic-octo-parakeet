import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { MapPin } from 'lucide-react'
import ReportButton from '@/components/feed/ReportButton'
import type { Post } from '@/types'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  showReport?: boolean
  index?: number
}

const CATEGORY_RIBBON_COLORS: Record<string, string> = {
  Alert: 'bg-red-600',
  Recommendation: 'bg-blue-600',
  'Lost & Found': 'bg-amber-600',
  Event: 'bg-purple-600',
  'Local Business': 'bg-emerald-600',
  Question: 'bg-indigo-600',
}

export default function PostCard({ post, showReport = true, index = 0 }: PostCardProps) {
  const ago = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
  const ribbonColor = CATEGORY_RIBBON_COLORS[post.category] ?? 'bg-primary'
  const displayName = post.profiles?.display_name
  const avatarUrl = post.profiles?.avatar_url
  const initials = displayName ? displayName[0].toUpperCase() : '?'

  // Stable random rotation based on index/id to break grid rigidity
  const rotations = ['-rotate-1', 'rotate-2', '-rotate-1.5', 'rotate-1', '-rotate-2']
  const rotation = rotations[index % rotations.length]

  return (
    <article className={cn("group transition-all duration-300 hover:z-20", rotation, "hover:rotate-0 hover:scale-[1.02]")}>
      <div className="pinned-card h-full flex flex-col p-6 pt-10">
        <div className="pin-icon" aria-hidden="true" />
        <div className={cn("category-ribbon", ribbonColor)}>
          {post.category}
        </div>

        {post.image_url && (
          <div className="relative h-44 w-full overflow-hidden rounded-xl mb-4 shrink-0 border border-border/50">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <Link
            href={`/feed/${post.id}`}
            className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm mb-2"
          >
            <h2 className="font-bold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-1">
            {post.body}
          </p>

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-2 min-w-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName ?? ''}
                  className="h-8 w-8 rounded-full object-cover shrink-0 border border-border shadow-sm"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 border border-primary/20 shadow-sm"
                  aria-hidden="true"
                >
                  {initials}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-foreground truncate">{displayName}</span>
                <span className="text-[10px] text-muted-foreground font-mono uppercase truncate">{ago}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono uppercase bg-muted/30 px-2 py-0.5 rounded border border-border/40">
                <MapPin size={10} aria-hidden="true" />
                {post.town}
              </div>
              {showReport && <ReportButton contentId={post.id} contentType="post" />}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
