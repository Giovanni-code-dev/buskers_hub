import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const CalendarForm = ({ onSuccess }) => {
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("unavailable")
  const { user } = useUser()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!date || !status) {
      toast({ variant: "destructive", title: "Compila tutti i campi" })
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ date, status }),
      })

      if (!res.ok) throw new Error("Errore nell’aggiunta della voce")

      toast({
        title: "Voce aggiunta",
        description: `Hai segnato il ${date} come ${
          status === "unavailable" ? "occupato" : "disponibile"
        }.`,
      })

      setDate("")
      setStatus("unavailable")

      if (onSuccess) onSuccess()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: error.message,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selettore data visuale con correzione timezone */}
        <div>
          <Label>Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date
                  ? format(new Date(date), "dd/MM/yyyy")
                  : "Seleziona una data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    const localDate = new Date(
                      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
                    )
                    setDate(localDate.toISOString().split("T")[0])
                  }
                }}
                disabled={(d) => d < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Selettore stato */}
        <div>
          <Label htmlFor="status">Stato</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Seleziona stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponibile</SelectItem>
              <SelectItem value="unavailable">Occupato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="mt-2 w-full sm:w-auto">
        Aggiungi al calendario
      </Button>
    </form>
  )
}

export default CalendarForm
