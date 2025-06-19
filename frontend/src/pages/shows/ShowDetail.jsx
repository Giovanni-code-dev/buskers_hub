import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "date-fns"
import { useUser } from "@/contexts/UserContext"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import ImageCarousel from "@/components/ui/ImageCarousel"

const ShowDetail = () => {
  const { id } = useParams()
  const { user } = useUser()
  const [show, setShow] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState("")
  const [message, setMessage] = useState("")
  const dialogRef = useRef()

  const [categoriesMap, setCategoriesMap] = useState({})

  // Recupero dati spettacolo e immagini
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://buskers-hub.onrender.com/categories")
        const data = await res.json()
        const map = {}
        data.forEach((cat) => {
          map[cat._id] = cat.name
        })
        setCategoriesMap(map)
      } catch (error) {
        console.error("Errore nel caricamento categorie:", error)
      }
    }

    fetchCategories()
  }, [])

  // Invio richiesta preventivo
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
          name: user.name,
          email: user.email,
          date,
          message,
        }),
      })

      if (!res.ok) throw new Error("Errore nell'invio della richiesta")
      alert(" Richiesta inviata con successo!")
      setDate("")
      setMessage("")
      dialogRef.current?.click()
    } catch (err) {
      console.error(err)
      alert(" Errore durante l'invio della richiesta.")
    }
  }

  const categoryId = typeof show?.category === "object" ? show.category._id : show?.category
  const categoryName = typeof show?.category === "object" && show.category.name
    ? show.category.name
    : categoriesMap?.[categoryId] || "Categoria"

  //  Stato loading
  if (loading) return <Skeleton className="h-72 w-full mt-10 rounded-xl" />
  if (!show) return <p className="text-center mt-10 text-red-500">Spettacolo non trovato.</p>

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-6">
      <h1 className="text-4xl font-bold text-center">{show.title}</h1>
      <p className="text-center text-muted-foreground">{show.description}</p>
      <p className="text-center">
        <strong>Categoria:</strong> {categoryName} — <strong>Durata:</strong> {show.durationMinutes} minuti
      </p>

      {/* Carosello Immagini */}
      <ImageCarousel images={images} />

      {/* Modale richiesta preventivo */}
      <div className="text-center mt-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button ref={dialogRef}>Contatta l’artista</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader className="text-center">
              <DialogTitle>Contatta {show.artist?.name || "l'artista"}</DialogTitle>
              <DialogDescription>
                Compila il modulo per contattare l’artista riguardo questo spettacolo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Data */}
              <div>
                <label className="text-sm block mb-1">Data evento</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date
                        ? format(new Date(date), "dd/MM/yyyy")
                        : <span className="text-muted-foreground">Seleziona una data</span>}
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

              {/* Messaggio */}
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
