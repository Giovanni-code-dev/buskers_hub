"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: ({ title, description, variant = "default", ...props }) =>
      sonnerToast[variant === "destructive" ? "error" : "message"](
        title,
        {
          description,
          ...props,
        }
      ),
  }
}
