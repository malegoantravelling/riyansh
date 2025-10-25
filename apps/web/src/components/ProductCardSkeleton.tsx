export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#EEEEEE] animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded-md mb-2" />
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-4" />

        {/* Stock Status */}
        <div className="h-3 bg-gray-200 rounded-md w-1/3 mb-3" />

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 bg-gray-200 rounded-md w-20" />
          <div className="h-4 bg-gray-200 rounded-md w-16" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="px-5 pb-5">
        <div className="h-12 bg-gray-200 rounded-md w-full" />
      </div>
    </div>
  )
}
