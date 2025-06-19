import { Skeleton } from "./skeleton"

const SkeletonCard = () => {
  return (
    <div className="w-full sm:w-64 rounded-xl overflow-hidden shadow border">
      <Skeleton className="w-full h-40" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export default SkeletonCard
