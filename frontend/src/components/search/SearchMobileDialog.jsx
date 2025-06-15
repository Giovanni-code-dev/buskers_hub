import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Search } from "lucide-react"
import ComboboxCity from "@/components/search/ComboboxCity" // Nuovo componente

// Opzioni di categoria
const categories = [
  "mimo",
  "clown",
  "giocoleria",
  "danza aerea",
  "fuoco",
  "trampoli",
]

/**
 * SearchMobileDialog
 * Modale step-by-step per filtrare artisti performer
 */
const SearchMobileDialog = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  // Filtri globali per la ricerca
  const [filters, setFilters] = useState({
    city: "",
    date: null,
    category: "",
  })

  // tato separato per città selezionata nel combobox
  const [selectedCity, setSelectedCity] = useState("")

  // Sincronizza selectedCity con filters.city
  useEffect(() => {
    setFilters((prev) => ({ ...prev, city: selectedCity }))
  }, [selectedCity])

  // Reset filtri ogni volta che si apre il modale
  useEffect(() => {
    if (open) {
      setFilters({ city: "", date: null, category: "" })
      setSelectedCity("")
      setStep(0)
    }
  }, [open])

  const next = () => setStep((prev) => prev + 1)
  const back = () => setStep((prev) => prev - 1)

  // Reset completo filtri e città
  const reset = () => {
    setFilters({ city: "", date: null, category: "" })
    setSelectedCity("")
    setStep(0)
    navigate("/home")
    setOpen(false)
  }

  // Costruisce i parametri della ricerca e reindirizza
  const submit = () => {
    const params = new URLSearchParams()
    if (filters.city) params.set("city", filters.city)
    if (filters.date) params.set("date", format(filters.date, "yyyy-MM-dd"))
    if (filters.category) params.set("category", filters.category)

    navigate(`/home?${params.toString()}`)
    setOpen(false)
  }

  // Step dinamici della modale
  const steps = [
    {
      title: "Luogo dell’evento",
      content: (
        <ComboboxCity
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      ),
    },
    {
      title: "Quando si terrà?",
      content: (
        <Calendar
          mode="single"
          selected={filters.date}
          onSelect={(date) => setFilters((prev) => ({ ...prev, date }))}
        />
      ),
    },
    {
      title: "Tipo di artista",
      content: (
        <Select
          value={filters.category}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ]

  return (
    <>
      {/* Bottone mobile per aprire il filtro */}
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
        variant="outline"
      >
        <Search className="h-4 w-4" />
        Filtra artisti
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{steps[step].title}</DialogTitle>
            <DialogDescription>
              Puoi compilare uno o più filtri per trovare artisti disponibili per il tuo evento.
            </DialogDescription>
          </DialogHeader>

          {/*  Contenuto step corrente */}
          <div className="py-4">{steps[step].content}</div>

          <DialogFooter className="flex justify-between gap-2">
            {step > 0 && (
              <Button variant="secondary" onClick={back}>
                ← Indietro
              </Button>
            )}
            {step < steps.length - 1 && (
              <Button onClick={next}>Avanti →</Button>
            )}
            {step === steps.length - 1 && (
              <Button onClick={submit} className="bg-primary hover:bg-primary/80 text-primary-foreground">
              Cerca artisti
              </Button>
            )}
            <Button variant="ghost" onClick={reset}>
              ♻️ Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SearchMobileDialog
