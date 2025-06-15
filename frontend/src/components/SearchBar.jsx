import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Search } from "lucide-react"
import ComboboxCity from "@/components/search/ComboboxCity"

const SearchBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState({
    city: "",
    category: "",
    date: null,
  })

  const [categories, setCategories] = useState([])
  const hasActiveFilters = location.search.length > 0

  const today = new Date()
  const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`)
        if (!res.ok) throw new Error("Errore nel caricamento categorie")
        const data = await res.json()
        console.log("Categorie caricate dal backend:", data)
        setCategories(data)
      } catch (error) {
        console.error(" Errore nel fetch delle categorie:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const city = params.get("city") || ""
    const category = params.get("category") || ""
    const dateParam = params.get("date")
    const parsedDate = dateParam ? new Date(dateParam) : null

    setFilters({
      city,
      category,
      date: parsedDate && !isNaN(parsedDate) ? parsedDate : null,
    })
  }, [location.search])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.city) params.set("city", filters.city)
    if (filters.category) params.set("category", filters.category)
    if (filters.date instanceof Date && !isNaN(filters.date)) {
      params.set("date", format(filters.date, "yyyy-MM-dd"))
    }
    navigate(`/home?${params.toString()}`)
  }

  const handleReset = () => {
    setFilters({ city: "", category: "", date: null })
    navigate("/home")
  }

  return (
<div className="flex w-full max-w-5xl items-center rounded-full border shadow-md bg-background text-foreground overflow-hidden divide-x divide-border px-2">
{/* Città */}
      <div className="px-4 py-3 flex-1 min-w-[140px]">
        <div className="text-xs font-semibold text-muted-foreground">Dove</div>
        <ComboboxCity
          value={filters.city}
          onChange={(city) =>
            setFilters((prev) => ({ ...prev, city }))
          }
        />
      </div>

      {/* Data evento */}
      <div className="px-4 py-3 flex-1 min-w-[140px]">
        <div className="text-xs font-semibold text-muted-foreground">Quando</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto text-sm font-normal">
              {filters.date ? format(filters.date, "PPP") : "Aggiungi data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.date}
              onSelect={(date) =>
                setFilters((prev) => ({ ...prev, date }))
              }
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/*  Categoria dinamica */}
      <div className="px-4 py-3 flex-1 min-w-[140px]">
        <div className="text-xs font-semibold text-muted-foreground">Categoria</div>
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              category: value === "all" ? "" : value,
            }))
          }
        >
          <SelectTrigger variant="ghost" className="p-0 h-auto text-sm font-normal">
            <SelectValue placeholder="Tutte le categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le categorie</SelectItem>
            {categories
              .filter((cat) => {
                const name = typeof cat === "string" ? cat : cat.name
                return typeof name === "string" && name.trim() !== ""
              })
              .map((cat) => {
                const name = typeof cat === "string" ? cat : cat.name
                const key = typeof cat === "string" ? cat : cat._id
                return (
                  <SelectItem key={key} value={name}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </SelectItem>
                )
              })}
          </SelectContent>
        </Select>
      </div>

      {/*  Pulsanti azione */}
      <div className="flex items-center gap-2 px-4 py-3">
        <Button
          size="icon"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/70"


          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
        </Button>

        {hasActiveFilters && (
          <Button
  variant="outline"
  className="rounded-full px-3 py-1 text-sm border-border hover:bg-gray-100"
  onClick={handleReset}
>
  ♻️
</Button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
