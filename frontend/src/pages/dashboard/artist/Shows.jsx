import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"
import ImageUploader from "@/components/form/ImageUploader"
import { Trash2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const Shows = () => {
  const { toast } = useToast()
  const { user } = useUser()

  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newShow, setNewShow] = useState({
    title: "",
    description: "",
    category: "",
    durationMinutes: 30,
  })

  const [file, setFile] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchShows()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      if (!res.ok) throw new Error("Errore nel caricamento categorie")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      toast({ title: "Errore", description: "Categorie non caricate", variant: "destructive" })
    }
  }

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
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Errore durante il salvataggio dello show")
      const saved = await res.json()

      if (isEdit) {
        setShows((prev) => prev.map((s) => (s._id === editId ? saved.show : s)))
        toast({ title: "Modificato", description: "Spettacolo aggiornato", variant: "default" })
      } else {
        setShows((prev) => [saved, ...prev])
        toast({ title: "Aggiunto", description: "Spettacolo aggiunto", variant: "default" })
      }

      resetForm()
    } catch (err) {
      console.error("Errore nel submit:", err)
      toast({ title: "Errore", description: "Salvataggio fallito", variant: "destructive" })
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
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Errore durante l'eliminazione")
      setShows((prev) => prev.filter((s) => s._id !== id))
      toast({ title: "Eliminato", description: "Spettacolo rimosso", variant: "default" })
    } catch (err) {
      console.error(err)
      toast({ title: "Errore", description: "Eliminazione fallita", variant: "destructive" })
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

      if (!res.ok) throw new Error("Errore nel salvataggio copertina")

      const data = await res.json()
      setExistingImages(data.images)
      toast({ title: "Successo", description: "Copertina aggiornata", variant: "default" })
    } catch (err) {
      console.error(err)
      toast({ title: "Errore", description: "Salvataggio copertina fallito", variant: "destructive" })
    }
  }

  const handleDeleteImage = async (public_id) => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${editId}/images`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_ids: [public_id] }),
      })

      if (!res.ok) throw new Error("Errore durante l'eliminazione")

      setExistingImages((prev) => prev.filter((img) => img.public_id !== public_id))
      toast({ title: "Eliminata", description: "Immagine rimossa", variant: "default" })
    } catch (err) {
      console.error(err)
      toast({ title: "Errore", description: "Eliminazione immagine fallita", variant: "destructive" })
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

        {!editMode && (
          <div>
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              value={newShow.category}
              onChange={(e) => setNewShow({ ...newShow, category: e.target.value })}
              className="w-full p-2 rounded-md border"
              required
            >
              <option value="">Seleziona una categoria</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
</option>

              ))}
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="durationMinutes">Durata (minuti)</Label>
          <Input
            id="durationMinutes"
            type="number"
            value={newShow.durationMinutes}
            onChange={(e) =>
              setNewShow({ ...newShow, durationMinutes: Number(e.target.value) })
            }
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
                      {img.isCover ? "Copertina" : "Imposta"}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-80 group-hover:opacity-100"
                      onClick={() => handleDeleteImage(img.public_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                size="sm"
                onClick={saveCoverChange}
                className="mt-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-all"
              >
                <Save className="w-4 h-4" />
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
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex flex-col justify-between flex-1 p-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{show.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {show.description}
                    </p>
                    <p className="text-sm">
  {
    categories.find((cat) => cat._id === show.category)?.name || show.category
  } — {show.durationMinutes} min
</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => editShow(show)}>
                      Modifica
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteShow(show._id)}>
                      Elimina
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Shows
