import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export const Checkbox = ({ checked, onChange, className }) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "h-5 w-5 rounded border border-gray-300 flex items-center justify-center",
        checked ? "bg-primary text-white" : "bg-white",
        className
      )}
    >
      {checked && <CheckIcon className="w-4 h-4" />}
    </button>
  )
}
