// src/hooks/useFontLoader.js
import { useEffect } from "react"

export const useFontLoader = (fontFamily) => {
  useEffect(() => {
    if (!fontFamily) return

    // Costruisci URL Google Fonts (semplificato)
    const base = "https://fonts.googleapis.com/css2?family="
    const fontName = fontFamily.split(",")[0].replace(/['"]/g, "").replace(/\s+/g, "+")
    const url = `${base}${fontName}&display=swap`

    const link = document.createElement("link")
    link.href = url
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [fontFamily])
}
