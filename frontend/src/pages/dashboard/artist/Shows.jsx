import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"
import ImageUploader from "@/components/form/ImageUploader"

const Shows = () => {
  const { user } = useUser()
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newShow, setNewShow] = useState({
    title: "",
    description: "",
    category: "altro",
    durationMinutes: 30,
  })

  const [file, setFile] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchShows()
  }, [])

  const fetchShows = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Errore nel caricamento")
      const data = await res.json()
      setShows(data)
    } catch (err) {
      setError("Errore nel caricamento degli spettacoli")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewShow({
      title: "",
      description: "",
      category: "altro",
      durationMinutes: 30,
    })
    setFile([])
    setExistingImages([])
    setEditMode(false)
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isEdit = editMode
    const url = `${import.meta.env.VITE_BACKEND_URL}/shows${isEdit ? `/${editId}` : ""}`
    const headers = {
      Authorization: `Bearer ${user?.token}`,
    }

    const formData = new FormData()
    formData.append("title", newShow.title)
    formData.append("description", newShow.description)
    formData.append("category", newShow.category)
    formData.append("durationMinutes", newShow.durationMinutes)

    if (file?.length > 0) {
      file.forEach((f) => formData.append("images", f))
    }

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers,
        body: formData,
      })

      if (!res.ok) throw new Error("Errore durante il salvataggio dello show")
      const saved = await res.json()

      if (isEdit) {
        setShows((prev) => prev.map((s) => (s._id === editId ? saved.show : s)))
      } else {
        setShows((prev) => [saved, ...prev])
      }

      resetForm()
    } catch (err) {
      console.error("Errore nel submit:", err)
      alert("Errore durante il salvataggio dello show.")
    }
  }

  const editShow = (show) => {
    setEditMode(true)
    setEditId(show._id)
    setNewShow({
      title: show.title,
      description: show.description,
      category: show.category,
      durationMinutes: show.durationMinutes,
    })
    setExistingImages(show.images || [])
    setFile([])
  }

  const deleteShow = async (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo spettacolo?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Errore durante l'eliminazione")
      setShows((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      console.error(err)
      setError("Errore durante l'eliminazione")
    }
  }

  const handleSetCover = (public_id) => {
    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.public_id === public_id,
      }))
    )
  }

  const saveCoverChange = async () => {
    try {
      const token = localStorage.getItem("token")
      const newOrder = existingImages.map((img) => ({
        public_id: img.public_id,
        isCover: img.isCover || false,
      }))

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${editId}/images/order`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newOrder }),
      })

      if (!res.ok) throw new Error("Errore nel salvataggio della copertina")

      const data = await res.json()
      alert(" Copertina aggiornata con successo!")
      setExistingImages(data.images)
    } catch (err) {
      console.error(err)
      alert("Errore durante il salvataggio della copertina")
    }
  }

  const handleDeleteImage = async (public_id) => {
    if (!confirm("Vuoi davvero eliminare questa immagine?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${editId}/images`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_ids: [public_id] }),
      })

      if (!res.ok) throw new Error("Errore durante l'eliminazione")

      const data = await res.json()
      setExistingImages((prev) => prev.filter((img) => img.public_id !== public_id))
    } catch (err) {
      console.error("Errore nell'eliminazione immagine:", err)
      alert("Errore durante l'eliminazione dell'immagine")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
         {editMode ? "Modifica spettacolo" : "Aggiungi spettacolo"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={newShow.title}
            onChange={(e) => setNewShow({ ...newShow, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Breve descrizione</Label>
          <textarea
            id="description"
            value={newShow.description}
            onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
            required
            rows={3}
            className="w-full p-2 border rounded-md resize-none"
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            value={newShow.category}
            onChange={(e) => setNewShow({ ...newShow, category: e.target.value })}
            className="w-full p-2 rounded-md border"
            required
          >
            <option value="danza aerea">Danza aerea</option>
            <option value="trampoli">Trampoli</option>
            <option value="giocoleria">Giocoleria</option>
            <option value="mimo">Mimo</option>
            <option value="fuoco">Fuoco</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div>
          <Label htmlFor="durationMinutes">Durata (minuti)</Label>
          <Input
            id="durationMinutes"
            type="number"
            value={newShow.durationMinutes}
            onChange={(e) => setNewShow({ ...newShow, durationMinutes: Number(e.target.value) })}
          />
        </div>

        <div className="md:col-span-3 space-y-2">
          <ImageUploader files={file} setFiles={setFile} />

          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-1">Immagini attuali:</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.url}
                      alt={`img-${i}`}
                      className={cn(
                        "w-24 h-24 object-cover rounded shadow border-2",
                        img.isCover ? "border-blue-600" : "border-transparent"
                      )}
                    />

                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      className="absolute bottom-1 left-1 bg-white/80 text-xs px-2 py-0.5 rounded shadow"
                      onClick={() => handleSetCover(img.public_id)}
                    >
                      {img.isCover ? "Copertina " : "Imposta"}
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-80 group-hover:opacity-100"
                      onClick={() => handleDeleteImage(img.public_id)}
                    >
                      elimina🗑
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={saveCoverChange}
              >
                 Salva copertina
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" className="md:col-span-3 w-full">
          {editMode ? "Salva modifiche" : "Aggiungi spettacolo"}
        </Button>
      </form>

      {loading && <p>Caricamento in corso...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shows.map((show) => {
          const coverImage = show.images?.find((img) => img.isCover) || show.images?.[0]
          return (
            <Card key={show._id} className="shadow-md flex flex-col h-[360px]">
              {coverImage && (
                <img
                  src={coverImage.url}
                  alt="Copertina spettacolo"
                  className="w-full h-48 object-cover rounded-t-md"
                />
              )}
<Card className="flex flex-col h-full overflow-hidden">
  <CardHeader className="p-0">
    <img
      src={show.images?.[0]?.url || '/placeholder.jpg'}
      alt={show.title}
      className="w-full h-40 object-cover"
    />
  </CardHeader>

  <CardContent className="p-4 flex-1 flex flex-col justify-between">
    <div className="space-y-1">
      <h2 className="text-lg font-semibold">{show.title}</h2>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {show.description}
      </p>
      <p className="text-sm text-muted-foreground italic">
        {show.category} — {show.durationMinutes} min
      </p>
    </div>
  </CardContent>

  <CardFooter className="p-4 flex justify-end gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => editShow(show)}
    >
      Modifica
    </Button>
    <Button
      variant="destructive"
      size="sm"
      onClick={() => deleteShow(show._id)}
    >
      Elimina
    </Button>
  </CardFooter>
</Card>

            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Shows
