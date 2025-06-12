import { loginArtist } from "@/services/authService"
import { useUser } from "@/contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const useLoginArtist = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useUser()

  const handleLogin = async (email, password) => {
    try {
      const data = await loginArtist(email, password)

      login({
        name: data.artist.name,
        email: data.artist.email,
        role: "artist",
        token: data.token,
      })

      navigate("/home")
    } catch (err) {
      setError(err.message)
      throw err  // Propaghiamo l'errore se serve
    }
  }

  return { handleLogin, error }
}

export default useLoginArtist
