'use client'

import { useState, useTransition } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toggleReaction } from '@/actions/reactions'
import type { ReactionCounts, ReactionType } from '@/actions/reactions'

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'helpful', emoji: '👍', label: 'Helpful' },
  { type: 'trust', emoji: '🛡️', label: 'Trustworthy' },
]

interface Props {
  postId: string
  initial: ReactionCounts
}

export default function PostReactions({ postId, initial }: Props) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [counts, setCounts] = useState(initial)
  const [isPending, startTransition] = useTransition()

  function handleReact(reaction: ReactionType) {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    const hadReaction = counts.userReactions.includes(reaction)
    setCounts((prev) => ({
      ...prev,
      [reaction]: hadReaction ? Math.max(0, prev[reaction] - 1) : prev[reaction] + 1,
      userReactions: hadReaction
        ? prev.userReactions.filter((r) => r !== reaction)
        : [...prev.userReactions, reaction],
    }))

    startTransition(async () => {
      await toggleReaction(postId, reaction)
    })
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {REACTIONS.map(({ type, emoji, label }) => {
        const active = counts.userReactions.includes(type)
        const count = counts[type]
        return (
          <button
            key={type}
            type="button"
            onClick={() => handleReact(type)}
            disabled={isPending}
            aria-label={`${label}: ${count} reaction${count !== 1 ? 's' : ''}. ${active ? 'Click to remove your reaction.' : 'Click to react.'}`}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${
              active
                ? 'bg-primary/10 border-primary/40 text-primary'
                : 'bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            <span role="img" aria-hidden="true">{emoji}</span>
            <span>{label}</span>
            {count > 0 && (
              <span className={`text-xs font-bold tabular-nums ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
      {!isSignedIn && (
        <span className="text-xs text-muted-foreground ml-1">Sign in to react</span>
      )}
    </div>
  )
}
