import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"

/**
 * Form per aggiungere una nuova voce al calendario (data disponibile o occupata).
 * Accetta una prop `onSuccess` per notificare il genitore in caso di aggiornamento.
 */
const CalendarForm = ({ onSuccess }) => {
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("unavailable") // Valore di default
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
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ date, status })
      })

      if (!res.ok) throw new Error("Errore nell’aggiunta della voce")

      toast({
        title: "Voce aggiunta",
        description: `Hai segnato il ${date} come ${status === "unavailable" ? "occupato" : "disponibile"}.`
      })

      setDate("")
      setStatus("unavailable")

      // Notifica il genitore per aggiornare la lista
      if (onSuccess) onSuccess()
    } catch (error) {
      toast({ variant: "destructive", title: "Errore", description: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

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
