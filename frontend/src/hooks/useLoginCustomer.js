// hooks/useLoginCustomer.js
import { loginCustomer } from "@/services/authService"
import { useUser } from "@/contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const useLoginCustomer = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useUser()

  const handleLogin = async (email, password) => {
    try {
      const data = await loginCustomer(email, password)

      login({
        name: data.customer.name,
        email: data.customer.email,
        role: "customer",
        token: data.token,
      })

      navigate("/home")
    } catch (err) {
      setError(err.message)
      throw err // aggiunto
    }
  }

  return { handleLogin, error }
}

export default useLoginCustomer
