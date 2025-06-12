import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GiDramaMasks, GiAngelWings } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GoogleRegisterButton from "@/components/ui/GoogleRegisterButton"
import { useUser } from "@/contexts/UserContext"

const RegisterSelector = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  // Se è già loggato, porta direttamente alla dashboard
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
          <h1 className="text-2xl font-bold">Registrati </h1>
          <p className="text-muted-foreground">Scegli se vuoi registrarti come artista o come cliente</p>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate("/register/artist")}>
              <GiDramaMasks size={24} className="mr-2" />
              Registrati come Artista
            </Button>

            <Button variant="secondary" className="w-full" onClick={() => navigate("/register/customer")}>
              <GiAngelWings size={24} className="mr-2" />
              Registrati come Cliente
            </Button>

            <hr className="my-4" />

            <GoogleRegisterButton role="artist" />
            <GoogleRegisterButton role="customer" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterSelector



