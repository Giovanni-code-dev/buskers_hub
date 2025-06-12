import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fontOptions = [
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Lobster", value: "'Lobster', cursive" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Comic Neue", value: "'Comic Neue', cursive" },
  { label: "Dancing Script", value: "'Dancing Script', cursive" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
]

const radiusOptions = [
  { label: "Piccolo", value: "0.25rem" },
  { label: "Medio", value: "0.5rem" },
  { label: "Grande", value: "0.75rem" },
  { label: "Completo", value: "9999px" },
]

const shadowOptions = [
  { label: "Nessuna", value: "none" },
  { label: "Media", value: "0 4px 6px rgba(0,0,0,0.1)" },
  { label: "Intensa", value: "0 6px 16px rgba(0,0,0,0.2)" },
]

const fontSizeOptions = [
  { label: "Piccolo", value: "0.875rem" },
  { label: "Normale", value: "1rem" },
  { label: "Grande", value: "1.125rem" },
  { label: "Extra", value: "1.25rem" },
]

const transitionOptions = [
  { label: "Linear", value: "linear" },
  { label: "Ease-in", value: "ease-in" },
  { label: "Ease-out", value: "ease-out" },
  { label: "Ease-in-out", value: "ease-in-out" },
]

const defaultTheme = {
  primaryColor: "#111827",
  backgroundColor: "#ffffff",
  accentColor: "#fbbf24",
  fontFamily: "'Inter', sans-serif",
  borderRadius: "0.75rem",
  shadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  fontSizeBase: "1rem",
  transitionStyle: "ease-in-out",
}

const Settings = () => {
  const { user } = useUser()
  const { refreshTheme } = useTheme()

  const [form, setForm] = useState(defaultTheme)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/profile`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })

        if (!res.ok) throw new Error("Errore nella fetch")

        const data = await res.json()
        if (data?.theme) setForm(data.theme)
      } catch (error) {
        console.error("Errore nel recupero del tema artista:", error)
      }
    }

    fetchTheme()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/me/theme`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Errore nel salvataggio")

      await refreshTheme()
      alert("Tema aggiornato con successo!")
    } catch (error) {
      console.error("Errore durante il salvataggio del tema:", error)
      alert("Errore nel salvataggio")
    }
  }

  const handleResetDefaults = () => {
    setForm(defaultTheme)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4">Personalizza il tuo stile</h1>

      {/* Anteprima in tempo reale */}
      <div
        className="rounded-xl p-6 shadow text-center"
        style={{
          backgroundColor: form.backgroundColor,
          color: form.primaryColor,
          fontFamily: form.fontFamily,
          fontSize: form.fontSizeBase,
          borderRadius: form.borderRadius,
          boxShadow: form.shadow,
          transition: `all 0.3s ${form.transitionStyle}`,
        }}
      >
        <p className="text-lg font-semibold mb-2">Anteprima</p>
        <p style={{ color: form.accentColor }}>
          Questo è un esempio di stile personalizzato
        </p>
      </div>

      {/* 🔧 Form impostazioni */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Colori */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="primaryColor">Colore Primario</Label>
          <Input type="color" name="primaryColor" value={form.primaryColor} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="backgroundColor">Colore Sfondo</Label>
          <Input type="color" name="backgroundColor" value={form.backgroundColor} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="accentColor">Colore Accento</Label>
          <Input type="color" name="accentColor" value={form.accentColor} onChange={handleChange} />
        </div>

        {/* Font */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="fontFamily">Font</Label>
          <Select
            value={form.fontFamily}
            onValueChange={(value) => setForm((prev) => ({ ...prev, fontFamily: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stile bordi */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="borderRadius">Raggio bordi</Label>
          <Select
            value={form.borderRadius}
            onValueChange={(value) => setForm((prev) => ({ ...prev, borderRadius: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona raggio" />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ombre */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="shadow">Ombra</Label>
          <Select
            value={form.shadow}
            onValueChange={(value) => setForm((prev) => ({ ...prev, shadow: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona ombra" />
            </SelectTrigger>
            <SelectContent>
              {shadowOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font size */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="fontSizeBase">Grandezza font</Label>
          <Select
            value={form.fontSizeBase}
            onValueChange={(value) => setForm((prev) => ({ ...prev, fontSizeBase: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona grandezza" />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transizione */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="transitionStyle">Transizione</Label>
          <Select
            value={form.transitionStyle}
            onValueChange={(value) => setForm((prev) => ({ ...prev, transitionStyle: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona stile" />
            </SelectTrigger>
            <SelectContent>
              {transitionOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pulsanti */}
        <div className="flex justify-between gap-4">
          <Button type="submit" className="flex-1">
             Salva
          </Button>
          <Button type="button" variant="outline" onClick={handleResetDefaults} className="flex-1">
            ♻️ Ripristina
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Settings
