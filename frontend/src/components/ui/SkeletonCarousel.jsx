import { Skeleton } from "./skeleton"

const SkeletonCarousel = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="w-40 h-28 rounded-md shrink-0" />
      ))}
    </div>
  )
}

export default SkeletonCarousel
