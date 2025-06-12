import { loginArtist, loginCustomer } from "@/services/authService"
import { useUser } from "@/contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

/**
 * Hook generico per il login in base al ruolo.
 * Supporta "artist" e "customer" (espandibile).
 *
 * @param {"artist" | "customer"} role - Il ruolo per cui effettuare il login.
 * @returns { handleLogin, error }
 */
const useLogin = (role = "customer") => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useUser()

  const handleLogin = async (email, password) => {
    try {
      const loginFn = role === "artist" ? loginArtist : loginCustomer
      const data = await loginFn(email, password)
  
      login({
        name: data.name,
        email: data.email,
        role,
        avatar: data.avatar,
        token: data.token,
        _id: data._id,
        model: data.model || role.charAt(0).toUpperCase() + role.slice(1)
      })
  
      navigate("/home")
    } catch (err) {
      setError(err.message || "Errore durante il login")
      throw err
    }
  }
  

  return { handleLogin, error }
}

export default useLogin
