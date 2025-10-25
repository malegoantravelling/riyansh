export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse">
        {/* Fake Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          <div className="w-20 h-6 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title - 2 lines */}
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 animate-pulse" />
        </div>

        {/* Description */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-full animate-pulse" />

        {/* Rating Stars */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded-sm animate-pulse" />
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded-md w-12 animate-pulse" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-24 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-md w-20 animate-pulse" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="px-5 pb-5">
        <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl w-full animate-pulse" />
      </div>
    </div>
  )
}
