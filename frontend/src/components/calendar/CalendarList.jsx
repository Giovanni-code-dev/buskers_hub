import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

/**
 * Lista delle voci del calendario dell’artista loggato.
 * Si aggiorna quando cambia la prop `refreshKey`.
 */
const CalendarList = ({ refreshKey }) => {
  const { user } = useUser()
  const { toast } = useToast()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCalendar = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/calendar`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      if (!res.ok) throw new Error("Errore nel recupero del calendario")

      const data = await res.json()
      setEntries(data)
    } catch (error) {
      toast({ variant: "destructive", title: "Errore", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendar()
  }, [refreshKey]) // si aggiorna ogni volta che cambia il refreshKey

  const handleDelete = async (id) => {
    const confirm = window.confirm("Vuoi davvero rimuovere questa voce?")
    if (!confirm) return

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/calendar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })

      if (!res.ok) throw new Error("Errore durante l'eliminazione")

      toast({ title: "Voce rimossa con successo" })
      setEntries((prev) => prev.filter((e) => e._id !== id))
    } catch (error) {
      toast({ variant: "destructive", title: "Errore", description: error.message })
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Date registrate</h2>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">Nessuna voce ancora registrata.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry._id}
              className="flex items-center justify-between border rounded-md px-4 py-2"
            >
              <span>
                {format(new Date(entry.date), "dd/MM/yyyy")} —{" "}
                <span
                  className={`font-medium ${
                    entry.status === "unavailable" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {entry.status === "unavailable" ? "Occupato" : "Disponibile"}
                </span>
              </span>

              <Button variant="destructive" size="sm" onClick={() => handleDelete(entry._id)}>
                Rimuovi
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CalendarList
