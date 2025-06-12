import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/contexts/UserContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const EditProfile = () => {
  const { user, setUser } = useUser()
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
    }

    if (user?.token) fetchProfile()
  }, [user?.token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert("Profilo aggiornato con successo!")
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } else {
      alert("Errore durante l'aggiornamento.")
    }
  }

  return (
    <div className="flex justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Modifica il tuo profilo artista</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Nome</Label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Es. Giocoliere Luminoso" />
            </div>
            <div>
              <Label>Biografia</Label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Scrivi una breve descrizione della tua arte, esperienze o stile..."
                className="min-h-[120px]"
              />
            </div>
            <div>
              <Label>Telefono</Label>
              <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+39 123 456 7890" />
            </div>
            <div>
              <Label>Sito Web</Label>
              <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://ilmiotempoartistico.it" />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/tuonome" />
            </div>
            <div>
              <Label>Facebook</Label>
              <Input name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/tuonome" />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input name="youtube" value={formData.youtube} onChange={handleChange} placeholder="https://youtube.com/@tuocanale" />
            </div>
            <div>
              <Label>Portfolio</Label>
              <Input name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Link a PDF o sito portfolio" />
            </div>
            <div>
              <Label>TikTok</Label>
              <Input name="tiktok" value={formData.tiktok} onChange={handleChange} placeholder="https://tiktok.com/@tuonome" />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full">Salva modifiche</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProfile
