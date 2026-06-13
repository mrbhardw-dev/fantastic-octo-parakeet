import { Skeleton } from '@/components/ui/skeleton'

export default function HelpLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Safety notice skeleton */}
      <Skeleton className="h-14 w-full rounded-xl mb-6" />

      {/* Filter pills */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-5 w-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
