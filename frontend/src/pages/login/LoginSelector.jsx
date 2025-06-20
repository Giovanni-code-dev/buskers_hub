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
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-6 space-y-6 text-center">
        <h1 className="text-2xl font-bold">Benvenuto in BuskersHub</h1>
        <p className="text-muted-foreground">Accedi come Artist o User</p>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate("/login/artist")}>
            <GiDramaMasks size={24} className="mr-2" />
            Login come Artist
          </Button>

          <Button variant="secondary" className="w-full" onClick={() => navigate("/login/customer")}>
            <GiAngelWings size={24} className="mr-2" />
            Login come User
          </Button>

          <hr className="my-4" />

          <GoogleLoginButton role="artist" />
          <GoogleLoginButton role="customer" />
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginSelector
