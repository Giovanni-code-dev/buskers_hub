import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GiDramaMasks, GiAngelWings } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GoogleLoginButton from "@/components/ui/GoogleLoginButton"
import { useUser } from "@/contexts/UserContext"

const LoginSelector = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === "artist") {
      navigate("/dashboard/artist")
    } else if (user?.role === "customer") {
      navigate("/dashboard/customer")
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-6 text-center">
          <h1 className="text-2xl font-bold">Benvenuto in Floating Dreams ✨</h1>
          <p className="text-muted-foreground">Accedi come artista o cliente</p>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate("/login/artist")}>
              <GiDramaMasks size={24} className="mr-2" />
              Login come Artista
            </Button>

            <Button variant="secondary" className="w-full" onClick={() => navigate("/login/customer")}>
              <GiAngelWings size={24} className="mr-2" />
              Login come Cliente
            </Button>

            <hr className="my-4" />

            <GoogleLoginButton role="artist" />
            <GoogleLoginButton role="customer" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginSelector
