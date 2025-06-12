// src/pages/dashboard/artist/Calendar.jsx

import { useState, useCallback } from "react"
import CalendarForm from "@/components/calendar/CalendarForm"
import CalendarList from "@/components/calendar/CalendarList"

/**
 * Pagina del calendario dell’artista.
 */
const Calendar = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  // Funzione per forzare il refresh
  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📅 Calendario disponibilità</h1>
      <p className="text-muted-foreground">
        Aggiungi o rimuovi date in cui sei disponibile o occupato.
      </p>

      {/* Form con callback per aggiornare la lista */}
      <CalendarForm onSuccess={triggerRefresh} />

      {/* Lista che si aggiorna al cambiamento di `refreshKey` */}
      <CalendarList refreshKey={refreshKey} />
    </div>
  )
}

export default Calendar
