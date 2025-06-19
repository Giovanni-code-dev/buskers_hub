import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"
import GoogleLoginButton from "./GoogleLoginButton"

const LoginArtistForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/artist/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login fallito")
      login(data)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full text-center">
      <h2 className="text-xl font-semibold">Accedi</h2>

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

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="text-sm text-muted-foreground">
        Non hai un account? <a href="#" className="text-primary underline">Registrati</a>
      </div>

      <Button type="submit" className="w-full">Accedi</Button>

      <div className="pt-2">
        <GoogleLoginButton role="artist" />
      </div>
    </form>
  )
}

export default LoginArtistForm
