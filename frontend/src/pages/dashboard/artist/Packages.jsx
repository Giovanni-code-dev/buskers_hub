import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"

const Packages = () => {
  const { user } = useUser()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [availableShows, setAvailableShows] = useState([])
  const [selectedShows, setSelectedShows] = useState([])
  const [imageFiles, setImageFiles] = useState([])

  const [newPackage, setNewPackage] = useState({
    title: "",
    description: "",
    price: ""
  })

  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchPackages()
    fetchMyShows()
  }, [])

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Errore nel caricamento")
      const data = await res.json()
      setPackages(data)
    } catch (err) {
      setError("Errore nel caricamento dei pacchetti")
    } finally {
      setLoading(false)
    }
  }

  const fetchMyShows = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setAvailableShows(data)
    }
  }

  const resetForm = () => {
    setNewPackage({ title: "", description: "", price: "" })
    setImageFiles([])
    setSelectedShows([])
    setEditMode(false)
    setEditId(null)
  }

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
  
    try {
      // Se stiamo modificando ed è stato selezionato almeno un file immagine
      if (editMode && imageFiles.length > 0) {
        const imageFormData = new FormData()
        imageFiles.forEach(file => imageFormData.append("images", file))
  
        const imageRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages/${editId}/images`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: imageFormData
        })
  
        if (!imageRes.ok) throw new Error("Errore nell'upload delle nuove immagini")
      }
  
      // Dati testuali e shows
      const data = {
        title: newPackage.title,
        description: newPackage.description,
        price: newPackage.price,
        shows: selectedShows
      }
  
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages${editMode ? `/${editId}` : ""}`, {
        method: editMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
  
      if (!res.ok) throw new Error("Errore nel salvataggio del pacchetto")
      const result = await res.json()
  
      setPackages(prev =>
        editMode ? prev.map(pkg => (pkg._id === result._id ? result : pkg)) : [...prev, result]
      )
      resetForm()
    } catch (err) {
      console.error(err)
      setError("Errore durante il salvataggio del pacchetto")
    }
  }
  

  const editPackage = (pkg) => {
    setEditMode(true)
    setEditId(pkg._id)
    setNewPackage({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price
    })
    setSelectedShows(pkg.shows.map(s => s._id || s)) // s può essere ObjectId o oggetto
    setImageFiles([])
  }

  const deletePackage = async (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo pacchetto?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Errore nell'eliminazione")
      setPackages(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
      setError("Errore durante l'eliminazione")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
         {editMode ? "Modifica pacchetto" : "Aggiungi pacchetto"}
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={newPackage.title}
            onChange={e => setNewPackage({ ...newPackage, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrizione</Label>
          <Input
            id="description"
            value={newPackage.description}
            onChange={e => setNewPackage({ ...newPackage, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Prezzo (€)</Label>
          <Input
            id="price"
            type="number"
            value={newPackage.price}
            onChange={e => setNewPackage({ ...newPackage, price: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-3 space-y-1">
          <Label htmlFor="images">Immagini</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="md:col-span-3">
          <Label>Collega a spettacoli</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {availableShows.map(show => (
              <label key={show._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={show._id}
                  checked={selectedShows.includes(show._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedShows(prev => [...prev, show._id])
                    } else {
                      setSelectedShows(prev => prev.filter(id => id !== show._id))
                    }
                  }}
                />
                <span>{show.title}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="md:col-span-3 w-full">
          {editMode ? "Salva modifiche" : " Aggiungi pacchetto"}
        </Button>
      </form>

      {/* Lista pacchetti */}
      {loading && <p>Caricamento in corso...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <Card key={pkg._id} className="shadow-md">
            {pkg.images?.length > 0 && (
              <img
                src={pkg.images.find(img => img.isCover)?.url || pkg.images[0].url}
                alt="Cover"
                className="w-full h-40 object-cover rounded-t"
              />
            )}
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{pkg.title}</h2>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
              <p className="font-bold">{pkg.price}€</p>

              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" onClick={() => editPackage(pkg)}>
                  ✏️ Modifica
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deletePackage(pkg._id)}>
                  Elimina
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Packages
