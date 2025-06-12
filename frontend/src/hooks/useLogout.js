import { useNavigate } from "react-router-dom"
import { useUser } from "@/contexts/UserContext"

const useLogout = () => {
  const navigate = useNavigate()
  const { logout } = useUser()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return { handleLogout }
}

export default useLogout
