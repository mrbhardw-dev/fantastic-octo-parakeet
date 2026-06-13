import { Card, CardContent } from '@/components/ui/card'
import type { Contributor } from '@/actions/reactions'

interface Props {
  contributors: Contributor[]
}

const RANK_STYLES = [
  { ring: 'ring-2 ring-yellow-400/60', bg: 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800', label: '1st', labelColor: 'bg-yellow-400 text-yellow-900' },
  { ring: 'ring-2 ring-slate-300/60', bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700', label: '2nd', labelColor: 'bg-slate-300 text-slate-800' },
  { ring: 'ring-2 ring-amber-500/50', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', label: '3rd', labelColor: 'bg-amber-500 text-white' },
  { ring: '', bg: 'border-border', label: '4th', labelColor: 'bg-muted text-muted-foreground' },
  { ring: '', bg: 'border-border', label: '5th', labelColor: 'bg-muted text-muted-foreground' },
]

function scoreBadge(c: Contributor): { emoji: string; label: string } | null {
  const max = Math.max(c.trustCount, c.helpfulCount, c.fireCount, c.heartCount)
  if (max === 0) return null
  if (c.trustCount === max) return { emoji: '🛡️', label: 'Most Trusted' }
  if (c.helpfulCount === max) return { emoji: '👍', label: 'Most Helpful' }
  if (c.fireCount === max) return { emoji: '🔥', label: 'Trending' }
  return { emoji: '❤️', label: 'Most Loved' }
}

export default function TopContributors({ contributors }: Props) {
  if (contributors.length === 0) return null

  return (
    <section className="py-14 px-4 bg-muted/20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-foreground">Community Stars</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The neighbours your community trusts and appreciates most
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {contributors.map((c, i) => {
            const style = RANK_STYLES[i] ?? RANK_STYLES[4]
            const initials = c.displayName ? c.displayName[0].toUpperCase() : '?'
            const badge = scoreBadge(c)
            return (
              <div key={c.profileId} className="w-[160px]">
                <Card className={`border ${style.bg} ${style.ring} transition-all duration-200 hover:shadow-md`}>
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                    {/* Rank badge */}
                    <span className={`self-end text-[10px] font-bold px-1.5 py-0.5 rounded-full ${style.labelColor}`}>
                      {style.label}
                    </span>

                    {/* Avatar */}
                    <div className="relative -mt-1">
                      {c.avatarUrl ? (
                        <img
                          src={c.avatarUrl}
                          alt={c.displayName}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-primary/20 text-primary text-xl font-bold flex items-center justify-center">
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
                      {c.displayName}
                    </p>

                    {/* Specialty badge */}
                    {badge && (
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {badge.emoji} {badge.label}
                      </span>
                    )}

                    {/* Reaction counts */}
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-1 border-t border-border w-full">
                      {c.trustCount > 0 && (
                        <span className="text-xs text-muted-foreground">🛡️ {c.trustCount}</span>
                      )}
                      {c.helpfulCount > 0 && (
                        <span className="text-xs text-muted-foreground">👍 {c.helpfulCount}</span>
                      )}
                      {c.fireCount > 0 && (
                        <span className="text-xs text-muted-foreground">🔥 {c.fireCount}</span>
                      )}
                      {c.heartCount > 0 && (
                        <span className="text-xs text-muted-foreground">❤️ {c.heartCount}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
