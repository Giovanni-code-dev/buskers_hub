import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GiDramaMasks } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/services/authService"

const RegisterArtist = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onRegister = async () => {
    try {
      await registerUser("artist", { name, email, password })
      navigate("/login/artist")
    } catch (err) {
      setError(err.message || "Errore durante la registrazione")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Registrazione Artista</h1>

          <Input
            placeholder="Nome d'arte"
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
            <GiDramaMasks className="mr-2 text-white dark:text-black" size={24} />
            Registrati
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterArtist
