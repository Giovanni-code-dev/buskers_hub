import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GiAngelWings } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/services/authService"

const RegisterCustomer = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onRegister = async () => {
    try {
      await registerUser("customer", { name, email, password })
      navigate("/login/customer")
    } catch (err) {
      setError(err.message || "Errore durante la registrazione")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Registrazione Cliente</h1>

          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <Button className="w-full" onClick={onRegister}>
            <GiAngelWings className="mr-2 text-white dark:text-black" size={24} />
            Registrati
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterCustomer
