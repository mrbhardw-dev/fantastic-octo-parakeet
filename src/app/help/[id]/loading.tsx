import { Skeleton } from '@/components/ui/skeleton'

export default function HelpPostLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <Skeleton className="h-4 w-36 mb-6" />

      <Skeleton className="h-6 w-28 rounded-full mb-4" />
      <Skeleton className="h-9 w-full mb-2" />
      <Skeleton className="h-9 w-3/4 mb-4" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      <div className="space-y-2 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>

      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  )
}
