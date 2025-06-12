import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "@/contexts/UserContext"

/**
 * Componente che protegge le route.
 * Se l'utente è loggato, mostra il contenuto. Altrimenti, reindirizza alla login.
 */
const ProtectedRoute = () => {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
