import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

// Importa i context
import { UserProvider } from "@/contexts/UserContext"
import { ThemeProvider } from "@/contexts/ThemeContext"

// Importa il componente Toaster (dal toast installato)
import { Toaster } from "@/components/ui/toaster"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <>
            <App />
            <Toaster /> {/* Componente necessario per mostrare i toast */}
          </>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
)
