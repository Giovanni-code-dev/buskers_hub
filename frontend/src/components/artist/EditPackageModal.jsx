import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"

const EditPackageModal = ({ pkg, availableShows, onUpdate }) => {
  const { user } = useUser()
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    title: pkg.title,
    description: pkg.description,
    price: pkg.price,
    shows: pkg.shows.map(s => s._id || s)
  })

  const [newImages, setNewImages] = useState([])

  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      // 📝 1. Aggiorna i dati testuali
      const resText = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages/${pkg._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: form.price,
          shows: form.shows,
        }),
      })

      if (!resText.ok) throw new Error("Errore aggiornamento dati")

      // 2. Se ci sono nuove immagini, invia separatamente
      if (newImages.length > 0) {
        const imgForm = new FormData()
        newImages.forEach(file => imgForm.append("images", file))

        const resImg = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages/${pkg._id}/images`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imgForm,
        })

        if (!resImg.ok) throw new Error("Errore aggiornamento immagini")
      }

      setOpen(false)
      onUpdate() // Ricarica lista pacchetti nel parent
    } catch (err) {
      console.error("Errore nella modifica:", err)
      alert("Errore durante la modifica del pacchetto.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">✏️ Modifica</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifica pacchetto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrizione</Label>
            <Input
              id="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Prezzo</Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="images">Aggiungi nuove immagini</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <Label>Collega a spettacoli</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
              {availableShows.map(show => (
                <label key={show._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={show._id}
                    checked={form.shows.includes(show._id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...form.shows, show._id]
                        : form.shows.filter(id => id !== show._id)
                      setForm(prev => ({ ...prev, shows: updated }))
                    }}
                  />
                  <span>{show.title}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Salva</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPackageModal
