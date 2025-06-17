import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useUser } from "@/contexts/UserContext"

const CustomerRequestsModal = () => {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests/me`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })

      if (!res.ok) throw new Error("Errore nel recupero richieste")

      const data = await res.json()
      setRequests(data)
    } catch (err) {
      console.error("Errore:", err)
      setError("Impossibile caricare le prenotazioni")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && user?.token) {
      fetchRequests()
    }
  }, [open, user?.token])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Prenotazioni
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Le tue richieste</DialogTitle>
          <DialogDescription>
            Qui trovi lo storico delle prenotazioni inviate.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : error ? (
<p className="text-destructive text-center">{error}</p>

        ) : requests.length === 0 ? (
          <p className="text-center text-muted-foreground">Nessuna richiesta inviata.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="border rounded-md p-4 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{req.artist?.name}</h3>
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
                <p> {req.shows?.map((s) => s.title).join(", ")}</p>
                <p>{format(new Date(req.date), "dd/MM/yyyy")}</p>
                {req.message && <p>📝 {req.message}</p>}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CustomerRequestsModal
