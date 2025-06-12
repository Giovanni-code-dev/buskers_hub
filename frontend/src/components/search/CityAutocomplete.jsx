// src/components/search/CityAutocomplete.jsx
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const CityAutocomplete = ({ selectedCity, setSelectedCity }) => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 1) return

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/cities?search=${query}`)
        if (!res.ok) throw new Error("Errore nel fetch delle città")
        const data = await res.json()
        setSuggestions(data)
      } catch (error) {
        console.error(" Errore fetch città:", error)
        setSuggestions([])
      }
    }

    const timeout = setTimeout(fetchSuggestions, 300) // debounce
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="space-y-2">
      <Label htmlFor="city">Città</Label>
      <Input
        id="city"
        placeholder="Es. Roma, Milano, Napoli..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setSelectedCity("") // reset selezione attuale
        }}
      />
      {suggestions.length > 0 && (
        <Command className="border rounded-md shadow mt-1 max-h-40 overflow-y-auto">
          <CommandList>
            {suggestions.map((city, index) => (
              <CommandItem
                key={index}
                value={city}
                onSelect={() => {
                  setSelectedCity(city)
                  setQuery(city)
                  setSuggestions([])
                }}
              >
                {city}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      )}
    </div>
  )
}

export default CityAutocomplete
