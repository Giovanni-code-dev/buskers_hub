import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent } from "@/components/ui/card"
import { jwtDecode } from "jwt-decode"

const RedirectGoogle = () => {
  const { login } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const error = urlParams.get("error")

    //  Login fallito (utente non trovato o rimosso)
    if (error === "unauthorized") {
      alert("⚠️ Login fallito: utente non autorizzato o inesistente.")
      navigate("/")
      return
    }

    // Login riuscito
    if (token) {
      try {
        const payload = jwtDecode(token)
        console.log("Avatar ricevuto dal token:", payload.avatar)

        const userData = {
          token,
          name: payload.name,
          email: payload.email,
          avatar: payload.avatar,
          role: payload.role,
        }

        // Salva utente nel contesto globale
        login(userData)

        // Reindirizza subito in base al ruolo
        if (payload.role === "artist") {
          navigate("/dashboard/artist")
        } else if (payload.role === "customer") {
          navigate("/dashboard/customer")
        } else {
          navigate("/")
        }
      } catch (error) {
        console.error("Errore durante la decodifica del token:", error)
        navigate("/")
      }
    } else {
      console.warn("Nessun token ricevuto dal backend")
      navigate("/")
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-xl font-semibold">Accesso in corso...</h1>
          <p className="text-muted-foreground">
            Stiamo aprendo le tende del tuo palcoscenico personale... 
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RedirectGoogle
