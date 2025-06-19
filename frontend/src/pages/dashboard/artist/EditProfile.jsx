import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/contexts/UserContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

const EditProfile = () => {
  const { user, setUser, refreshUser } = useUser()

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    telefono: "",
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    portfolio: "",
    tiktok: "",
  })

  const [locationData, setLocationData] = useState({ city: "", address: "" })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`)
      const data = await res.json()
      setAvailableCategories(data)
    }

    if (user?.token) fetchCategories()
  }, [user?.token])

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      const data = await res.json()

      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        telefono: data.telefono || "",
        website: data.website || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        youtube: data.youtube || "",
        portfolio: data.portfolio || "",
        tiktok: data.tiktok || "",
      })

      setLocationData({
        city: data.location?.city || "",
        address: data.location?.address || "",
      })

      setAvatarPreview(data.avatar || "")
      setSelectedCategories(data.categories?.map((cat) => cat._id) || [])
    }

    if (user?.token) fetchProfile()
  }, [user?.token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLocationChange = (e) => {
    setLocationData({ ...locationData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleCategorySubmit = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ categories: selectedCategories }),
    })

    if (res.ok) {
      toast.success("Categorie aggiornate con successo!")
    } else {
      toast.error("Errore durante l'aggiornamento delle categorie.")
    }
  }

  const handleAvatarUpload = async (e) => {
    e.preventDefault()
    if (!avatarFile) return toast.error("Seleziona un'immagine prima di inviare!")

    const form = new FormData()
    form.append("avatar", avatarFile)

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/update-profile`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${user?.token}` },
      body: form,
    })

    if (res.ok) {
      toast.success("Avatar aggiornato con successo!")
      const data = await res.json()
      setAvatarPreview(data.avatar)
      await refreshUser()

      const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      const profileData = await profileRes.json()

      setFormData({
        name: profileData.name || "",
        bio: profileData.bio || "",
        telefono: profileData.telefono || "",
        website: profileData.website || "",
        instagram: profileData.instagram || "",
        facebook: profileData.facebook || "",
        youtube: profileData.youtube || "",
        portfolio: profileData.portfolio || "",
        tiktok: profileData.tiktok || "",
      })

      setLocationData({
        city: profileData.location?.city || "",
        address: profileData.location?.address || "",
      })

      setSelectedCategories(profileData.categories?.map((cat) => cat._id) || [])
    } else {
      toast.error("Errore durante l'upload dell'avatar.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const body = { ...formData, categories: selectedCategories }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      toast.success("Profilo aggiornato con successo!")
      const updatedUser = { ...user, ...formData, categories: selectedCategories }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } else {
      toast.error("Errore durante l'aggiornamento del profilo.")
    }
  }

  const handleLocationSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/update-location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(locationData),
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Posizione aggiornata con successo!")
    } else {
      toast.error("Errore durante l'aggiornamento della posizione: " + data.message)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-10 sm:px-6 lg:px-8">

      {/* Avatar */}
      <Card className="w-full max-w-2xl border shadow-md rounded-2xl">
        <CardHeader><CardTitle className="text-xl font-semibold">Aggiorna Avatar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {avatarPreview && (
            <img src={avatarPreview} alt="Anteprima avatar" className="w-32 h-32 rounded-full object-cover mx-auto border" />
          )}
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          <Button type="button" onClick={handleAvatarUpload} className="w-full">Carica nuovo avatar</Button>
        </CardContent>
      </Card>

      {/* Categorie */}
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl border border-muted">
        <CardHeader><CardTitle className="text-xl font-semibold">Categorie artistiche</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {availableCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Caricamento categorie...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableCategories.map((cat) =>
                cat?._id ? (
                  <label key={cat._id} className="flex items-center space-x-2 rounded-md border p-2 shadow-sm hover:bg-accent cursor-pointer">
                    <Checkbox checked={selectedCategories.includes(cat._id)} onChange={() => toggleCategory(cat._id)} />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ) : null
              )}
            </div>
          )}
          <Button onClick={handleCategorySubmit} className="w-full mt-4">Aggiorna categorie</Button>
        </CardContent>
      </Card>

      {/* Profilo */}
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-muted">
        <CardHeader><CardTitle className="text-2xl font-bold">Modifica il tuo profilo artista</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><Label>Nome</Label><Input name="name" value={formData.name} onChange={handleChange} /></div>
            <div><Label>Biografia</Label><Textarea name="bio" value={formData.bio} onChange={handleChange} className="min-h-[120px]" /></div>
            <div><Label>Telefono</Label><Input name="telefono" value={formData.telefono} onChange={handleChange} /></div>
            <div><Label>Sito Web</Label><Input name="website" value={formData.website} onChange={handleChange} /></div>
            <div><Label>Instagram</Label><Input name="instagram" value={formData.instagram} onChange={handleChange} /></div>
            <div><Label>Facebook</Label><Input name="facebook" value={formData.facebook} onChange={handleChange} /></div>
            <div><Label>YouTube</Label><Input name="youtube" value={formData.youtube} onChange={handleChange} /></div>
            <div><Label>Portfolio</Label><Input name="portfolio" value={formData.portfolio} onChange={handleChange} /></div>
            <div><Label>TikTok</Label><Input name="tiktok" value={formData.tiktok} onChange={handleChange} /></div>
            <Button type="submit" className="w-full">Salva modifiche</Button>
          </form>
        </CardContent>
      </Card>

      {/* Posizione */}
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl border border-muted">
        <CardHeader><CardTitle className="text-xl font-semibold">Aggiorna la tua posizione</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleLocationSubmit} className="space-y-5">
            <div><Label>Città</Label><Input name="city" value={locationData.city} onChange={handleLocationChange} /></div>
            <div><Label>Indirizzo</Label><Input name="address" value={locationData.address} onChange={handleLocationChange} /></div>
            <Button type="submit" className="w-full">Aggiorna posizione</Button>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}

export default EditProfile
