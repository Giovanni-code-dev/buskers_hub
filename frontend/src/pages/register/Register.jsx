import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GiDramaMasks, GiAngelWings } from "react-icons/gi"
import GoogleRegisterButton from "@/components/ui/GoogleRegisterButton"

const Register = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-6 text-center">
          <h1 className="text-2xl font-bold">Registrati su Floating Dreams ✨</h1>
          <p className="text-muted-foreground">Scegli il tuo ruolo per iniziare</p>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate("/register/artist")}>
              <GiDramaMasks className="mr-2" size={24} />
              Registrati come Artista
            </Button>

            <Button variant="secondary" className="w-full" onClick={() => navigate("/register/customer")}>
              <GiAngelWings className="mr-2" size={24} />
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

export default Register
