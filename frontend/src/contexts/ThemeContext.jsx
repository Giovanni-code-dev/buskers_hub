// ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "./UserContext"
import { useFontLoader } from "@/hooks/useFontLoader"

// Crea il contesto globale per il tema
const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const { user } = useUser()

  // Modalità tema chiaro/scuro salvata in localStorage
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  // Stato locale per il tema dell'artista
  const [artistTheme, setArtistTheme] = useState({
    primaryColor: "#111827",
    backgroundColor: "#ffffff",
    accentColor: "#fbbf24",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.75rem",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontSizeBase: "1rem",
    transitionStyle: "ease-in-out",
  })

  // Carica dinamicamente il font scelto dall'artista da Google Fonts
  useFontLoader(artistTheme.fontFamily)

  /**
   * Recupera il profilo artista dal backend
   * e aggiorna il tema locale
   */
  const refreshTheme = async () => {
    if (!user?.token || user.role !== "artist") return

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (data?.theme) {
        setArtistTheme(data.theme)
        console.log("Tema ricevuto dal profilo artista:", data.theme)
      }
    } catch (error) {
      console.error(" Errore nel recupero del tema artista:", error)
    }
  }

  /**
   * Inietta le variabili CSS globali nel <html>
   * per supportare personalizzazione via Tailwind/shadcn
   */
  useEffect(() => {
    const root = document.documentElement

    if (artistTheme) {
      root.style.setProperty("--artist-primary", artistTheme.primaryColor)
      root.style.setProperty("--artist-bg", artistTheme.backgroundColor)
      root.style.setProperty("--artist-accent", artistTheme.accentColor)
      root.style.setProperty("--artist-font", artistTheme.fontFamily)
      root.style.setProperty("--artist-radius", artistTheme.borderRadius)
      root.style.setProperty("--artist-shadow", artistTheme.shadow)
      root.style.setProperty("--artist-font-size", artistTheme.fontSizeBase)
      root.style.setProperty("--artist-transition", artistTheme.transitionStyle)
    }
  }, [artistTheme])

  /**
   * Gestisce il toggle tra dark mode e light mode
   */
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"))
  }

  // Applica la modalità dark/light al DOM e la salva in localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
    localStorage.setItem("theme", mode)
  }, [mode])

  // Ricarica il tema quando cambia utente
  useEffect(() => {
    refreshTheme()
  }, [user])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, artistTheme, refreshTheme }}>
      <div
        style={{
          "--artist-bg": artistTheme.backgroundColor,
          "--artist-primary": artistTheme.primaryColor,
          "--artist-accent": artistTheme.accentColor,
          "--artist-font": artistTheme.fontFamily,
          "--artist-radius": artistTheme.borderRadius,
          "--artist-shadow": artistTheme.shadow,
          "--artist-font-size": artistTheme.fontSizeBase,
          "--artist-transition": artistTheme.transitionStyle,
        }}
        className="min-h-screen font-[var(--artist-font)] text-[var(--artist-primary)] bg-[var(--artist-bg)] transition-all"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
