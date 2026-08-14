import { Skeleton } from '@/components/ui/skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-forest/8 bg-white/80 p-4 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="mb-4 aspect-square w-full rounded-xl" />
      <Skeleton className="mx-auto mb-2 h-5 w-3/4" />
      <Skeleton className="mx-auto mb-2 h-5 w-1/2" />
      <Skeleton className="mx-auto mb-4 h-4 w-24" />
      <div className="mt-auto flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
      </div>
    </div>
  )
}
