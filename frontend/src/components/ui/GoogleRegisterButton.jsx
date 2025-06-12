import { Button } from "@/components/ui/button"

/**
 * Pulsante per registrarsi con Google.
 * Reindirizza alla rotta backend corretta in base al ruolo.
 *
 * @param {string} role - "artist" o "customer"
 */
const GoogleRegisterButton = ({ role = "customer" }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const handleGoogleRegister = () => {
    window.location.href = `${backendURL}/auth/google/register/${role}`
  }

  return (
    <Button onClick={handleGoogleRegister} variant="outline" className="w-full">
      Registrati con Google come {role === "artist" ? "Artista" : "Cliente"}
    </Button>
  )
}

export default GoogleRegisterButton
