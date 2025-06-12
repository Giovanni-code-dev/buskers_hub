// components/ui/GoogleLoginButton.jsx

import { Button } from "@/components/ui/button"

/**
 * Pulsante per avviare il login con Google.
 * Reindirizza alla rotta backend corretta in base al ruolo.
 *
 * @param {string} role - "artist" o "customer"
 */
const GoogleLoginButton = ({ role = "customer" }) => {
  const handleGoogleLogin = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL
    window.location.href = `${backendURL}/auth/google/${role}`
  }

  return (
    <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
      Accedi con Google come {role === "artist" ? "Artista" : "Cliente"}
    </Button>
  )
}

export default GoogleLoginButton
