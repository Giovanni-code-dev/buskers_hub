import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { Link } from "react-router-dom"

const DashboardArtist = () => {
  const { user } = useUser()
  const [showCount, setShowCount] = useState(0)
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [showsRes, requestsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/shows`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/requests/artist`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ])

        const showsData = await showsRes.json()
        const requestsData = await requestsRes.json()

        if (Array.isArray(showsData)) setShowCount(showsData.length)
        if (Array.isArray(requestsData)) setRequestCount(requestsData.length)
      } catch (err) {
        console.error("Errore nella fetch dei conteggi:", err)
      }
    }

    if (user?.token) fetchCounts()
  }, [user?.token])

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Benvenuto nella tua area artista</h1>

      <Card className="max-w-xl mx-auto shadow-lg border-muted">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/artist/edit-profile" className="shrink-0 group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar artista"
                  className="w-16 h-16 rounded-full object-cover border border-muted transition duration-200 group-hover:ring-2 group-hover:ring-primary"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-primary transition duration-200 group-hover:ring-2 group-hover:ring-primary">
                  {user?.name?.[0] || "A"}
                </div>
              )}
            </Link>

            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Ciao {user?.name || "Artista"}!
              </h2>
              <p className="text-muted-foreground text-sm">
                Benvenuto nella tua dashboard personale.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground">
            Gestisci i tuoi spettacoli e le richieste ricevute. Usa la barra laterale o clicca sulle
            card qui sotto per accedere alle sezioni.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-xl mx-auto">
        <Link to="/dashboard/artist/shows">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary">Spettacoli</h3>
              <p className="text-2xl font-bold mt-2">{showCount}</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/artist/requests">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary">Richieste ricevute</h3>
              <p className="text-2xl font-bold mt-2">{requestCount}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default DashboardArtist
