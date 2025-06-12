// src/pages/dashboard/artist/RequestsReceived.jsx
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useUser } from "@/contexts/UserContext"

const RequestsReceived = () => {
  const { user } = useUser()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests/artist`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })

        if (!res.ok) throw new Error("Errore nel recupero richieste")
        const data = await res.json()
        setRequests(data)
      } catch (err) {
        console.error("Errore:", err)
        setError("Errore nel caricamento delle richieste")
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) {
      fetchRequests()
    }
  }, [user?.token])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Errore aggiornamento stato")

      const updated = await res.json()

      setRequests((prev) =>
        prev.map((req) => (req._id === updated._id ? updated : req))
      )
    } catch (err) {
      console.error("Errore aggiornamento:", err)
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center"> Richieste Ricevute</h1>

      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-muted-foreground">Nessuna richiesta ricevuta</p>
      ) : (
        requests.map((req) => (
          <Card key={req._id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{req.customer?.name}</h2>
                  <p className="text-sm text-muted-foreground">{req.customer?.email}</p>
                </div>
                <Badge
                  variant={
                    req.status === "accepted"
                      ? "default"
                      : req.status === "declined"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {req.status}
                </Badge>
              </div>

              <p>Spettacoli: {req.shows.map((s) => s.title).join(", ")}</p>
              <p> Data: {format(new Date(req.date), "dd/MM/yyyy")}</p>
              {req.message && <p> Messaggio: {req.message}</p>}

              {req.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleStatusChange(req._id, "accepted")}>
                    Accetta
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange(req._id, "declined")}
                  >
                     Rifiuta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export default RequestsReceived
