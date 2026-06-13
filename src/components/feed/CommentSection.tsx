'use client'

import { useState, useRef, useTransition } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createComment } from '@/actions/comments'
import type { Comment } from '@/actions/comments'
import { toast } from 'sonner'

interface Props {
  postId: string
  initialComments: Comment[]
}

export default function CommentSection({ postId, initialComments }: Props) {
  const { isSignedIn } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    const body = (formData.get('body') as string).trim()
    if (!body) return

    startTransition(async () => {
      const result = await createComment(postId, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        formRef.current?.reset()
        toast.success('Comment posted!')
      }
    })
  }

  return (
    <section className="mt-10 pt-8 border-t border-border">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground mb-6">
        <MessageCircle size={16} aria-hidden="true" />
        Comments
        {comments.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-5 mb-8">
          {comments.map((c) => {
            const name = c.profiles?.display_name
            const avatar = c.profiles?.avatar_url
            const initials = name ? name[0].toUpperCase() : '?'
            return (
              <div key={c.id} className="flex gap-3">
                {avatar ? (
                  <img src={avatar} alt={name ?? ''} className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{name ?? 'Community member'}</span>
                    <time className="text-xs text-muted-foreground" dateTime={c.created_at}>
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </time>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{c.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">No comments yet. Be the first to start the conversation.</p>
      )}

      {/* Comment form */}
      {isSignedIn ? (
        <form ref={formRef} action={handleSubmit} className="flex gap-3">
          <div className="flex-1">
            <textarea
              name="body"
              placeholder="Add a comment…"
              required
              maxLength={1000}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none leading-relaxed"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="cursor-pointer self-end gap-2 min-h-[44px]"
          >
            <Send size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{isPending ? 'Posting…' : 'Post'}</span>
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">Sign in to join the conversation</p>
          <Link href="/sign-in">
            <Button size="sm" className="cursor-pointer">Sign in to comment</Button>
          </Link>
        </div>
      )}
    </section>
  )
}
