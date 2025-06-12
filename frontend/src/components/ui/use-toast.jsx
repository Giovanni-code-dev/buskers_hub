// src/components/ui/toast.jsx

import React, { createContext, useState } from "react"
import { Toaster as RadixToaster } from "@/components/ui/toaster"

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <RadixToaster toasts={toasts} />
    </ToastContext.Provider>
  )
}
