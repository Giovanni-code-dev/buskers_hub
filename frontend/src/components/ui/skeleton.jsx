import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-primary/20",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
