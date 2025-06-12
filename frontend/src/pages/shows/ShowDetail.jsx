import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/contexts/UserContext"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"

const ShowDetail = () => {
  const { id } = useParams()
  const { user } = useUser()
  const [show, setShow] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState("")
  const [message, setMessage] = useState("")
  const dialogRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          artist: show.artist,
          shows: [show._id],
          name: user.name,     //  Preso da UserContext
          email: user.email,   // Preso da UserContext
          date,
          message,
        }),
      })

      if (!res.ok) throw new Error("Errore nell'invio della richiesta")

      alert("✅ Richiesta inviata con successo!")

      // Reset campi e chiudi modale
      setDate("")
      setMessage("")
      dialogRef.current?.click()
    } catch (err) {
      console.error(err)
      alert(" Errore durante l'invio della richiesta.")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resShow, resImages] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${id}`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${id}/images`)
        ])

        if (!resShow.ok || !resImages.ok) throw new Error("Errore nel caricamento dati")

        const showData = await resShow.json()
        const imagesData = await resImages.json()

        setShow(showData)
        setImages(imagesData)
      } catch (error) {
        console.error("Errore nel caricamento spettacolo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <Skeleton className="h-64 w-full mt-10" />
  if (!show) return <p className="text-center mt-10 text-red-500">Spettacolo non trovato.</p>

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">{show.title}</h1>
      <p className="text-center text-muted-foreground">{show.description}</p>
      <p className="text-center">
        <strong>Categoria:</strong> {show.category} — <strong>Durata:</strong> {show.durationMinutes} minuti
      </p>

      {/* Carosello Immagini */}
      {images.length > 0 && (
        <Carousel className="w-full max-w-2xl mx-auto">
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={img.public_id || index}>
                <img
                  src={img.url}
                  alt={`Immagine ${index + 1}`}
                  className="rounded-md w-full h-[320px] object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      {/* Bottone con modale */}
      <div className="text-center mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button ref={dialogRef}> Contatta l’artista</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Richiesta preventivo</DialogTitle>
              <DialogDescription>
                Compila il modulo per contattare l’artista riguardo questo spettacolo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm block mb-1">Data evento</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date ? format(new Date(date), "dd/MM/yyyy") : <span className="text-muted-foreground">Seleziona una data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date ? new Date(date) : undefined}
                      onSelect={(selected) => {
                        if (selected) setDate(format(selected, "yyyy-MM-dd"))
                      }}
                      disabled={(day) => day < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm">Messaggio</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Scrivi qui il tuo messaggio per l'artista..."
                />
              </div>

              <DialogFooter>
                <Button type="submit">Invia richiesta</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ShowDetail
