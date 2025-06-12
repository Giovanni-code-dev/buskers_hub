import { useEffect, useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import ComboboxCity from "./ComboboxCity"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useLocation, useNavigate } from "react-router-dom"
import { SlidersHorizontal } from "lucide-react"

const SearchMobilePopover = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [city, setCity] = useState("")
  const [date, setDate] = useState(null)
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

  // Fetch categorie disponibili dal backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error("Dati categoria non validi")
        setCategories(data)
        console.log(" Categorie caricate:", data)
      } catch (err) {
        console.error(" Errore nel recupero categorie:", err)
      }
    }
    fetchCategories()
  }, [])

  // Reset se non ci sono query nell'URL
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    if (query.toString().length === 0) {
      setCity("")
      setDate(null)
      setCategory("")
    }
  }, [location.search])

  const next = () => setStep((s) => Math.min(s + 1, 2))
  const prev = () => setStep((s) => Math.max(s - 1, 0))
  const reset = () => {
    setStep(0)
    setCity("")
    setDate(null)
    setCategory("")
  }

  const search = () => {
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    if (category && category !== "all") params.set("category", category)

    const url = `/home?${params.toString()}`
    navigate(url)
    setOpen(false)
    reset()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex justify-center my-4">
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="gap-2 rounded-full px-5 py-2 shadow-md text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtra artisti
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent
  className="w-[280px] p-4 space-y-4 animate-in fade-in zoom-in-90 slide-in-from-top-4 duration-500"
>
        {step === 0 && (
          <>
            <h4 className="text-sm font-medium">1. Città</h4>
            <ComboboxCity value={city} onChange={setCity} />
            <div className="flex justify-end">
              <Button onClick={next}>Avanti</Button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h4 className="text-sm font-medium">2.  Data</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date()}
              initialFocus
            />
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={prev}>Indietro</Button>
              <Button onClick={next}>Avanti</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h4 className="text-sm font-medium">3.  Categoria</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                key="all"
                variant={category === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory("all")}
              >
                Tutte le categorie
              </Button>
              {categories.map((cat) => {
                const name = typeof cat === "string" ? cat : cat.name
                const key = typeof cat === "string" ? cat : cat._id
                return (
                  <Button
                    key={key}
                    variant={category === name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(name)}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Button>
                )
              })}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={prev}>Indietro</Button>
              <Button onClick={search}>Cerca</Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default SearchMobilePopover
