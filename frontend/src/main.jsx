import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "@/styles/themes/dark-theme.css"
import "./index.css"

import { UserProvider } from "@/contexts/UserContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Toaster } from "@/components/ui/toaster"

// ✅ Forza il tema dark (usa le variabili .dark di index.css)
document.documentElement.classList.add("dark")

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <>
            <App />
            <Toaster />
          </>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
)
