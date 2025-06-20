import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import ArtistLoginModal from "@/components/auth/ArtistLoginModal"
import CustomerLoginModal from "@/components/auth/CustomerLoginModal"

const LoginDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">Accedi</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-full">
        <DropdownMenuItem asChild>
          <ArtistLoginModal
            trigger={
              <Button variant="ghost" className="w-full justify-start">
                Accedi come Artist
              </Button>
            }
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <CustomerLoginModal
            trigger={
              <Button variant="ghost" className="w-full justify-start">
                Accedi come User
              </Button>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LoginDropdown
