import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

const GoogleLoginButton = ({ role }) => {
  const href = `https://buskers-hub.onrender.com/auth/google/register/${role}`

  return (
    <a href={href}>
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-xl" />
        Accedi con Google
      </Button>
    </a>
  )
}

export default GoogleLoginButton
