import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"

const Project = () => {
  const { user } = useUser()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: ""
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Errore nel caricamento")

      const data = await res.json()
      setProjects(data)
    } catch (err) {
      setError("Errore nel caricamento dei progetti")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      })

      if (!res.ok) throw new Error("Errore nella creazione del progetto")

      const created = await res.json()
      setProjects(prev => [...prev, created])
      setNewProject({ title: "", description: "", budget: "" })
    } catch (err) {
      console.error(err)
      setError("Errore durante l'aggiunta del progetto")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold"> I tuoi Progetti</h1>

      {/* Form di aggiunta */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={newProject.title}
            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrizione</Label>
          <Input
            id="description"
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget (€)</Label>
          <Input
            id="budget"
            type="number"
            value={newProject.budget}
            onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="md:col-span-3 w-full">
          Aggiungi progetto
        </Button>
      </form>

      {/* Lista progetti */}
      {loading && <p>Caricamento in corso...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map(proj => (
          <Card key={proj._id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{proj.title}</h2>
              <p className="text-sm text-muted-foreground">{proj.description}</p>
              <p className="font-bold">{proj.budget}€</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Project
