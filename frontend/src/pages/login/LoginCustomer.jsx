import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GiAngelWings } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import useLogin from "@/hooks/useLogin"
import { useUser } from "@/contexts/UserContext"

const LoginCustomer = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { handleLogin, error } = useLogin("customer")
  const { user } = useUser()
  const navigate = useNavigate()

  //  Redirect automatico se già loggato come customer
  useEffect(() => {
    if (user?.role === "customer") {
      navigate("/dashboard/customer")
    }
  }, [user, navigate])

  const onLogin = async () => {
    try {
      await handleLogin(email, password)
    } catch (err) {
      // Errore già gestito nell’hook
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Login User</h1>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full" onClick={onLogin}>
            <GiAngelWings className="mr-2 text-white dark:text-black" size={24} />
            Accedi
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginCustomer
