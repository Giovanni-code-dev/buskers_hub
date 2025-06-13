import { Link, useLocation } from "react-router-dom"
import { useTheme } from "@/contexts/ThemeContext"
import { useUser } from "@/contexts/UserContext"
import useLogout from "@/hooks/useLogout"

import SearchBar from "@/components/SearchBar"
import SearchMobilePopover from "@/components/search/SearchMobilePopover"
import CustomerRequestsModal from "@/components/customer/CustomerRequestsModal"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  LogOut,
  User,
  Sun,
  Moon,
  LayoutDashboard,
  Settings,
  Menu,
} from "lucide-react"

const Navbar = () => {
  const location = useLocation()
  const { user } = useUser()
  const { handleLogout } = useLogout()
  const { theme, toggleTheme } = useTheme()

  if (location.pathname === "/") return null

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 bg-card text-card-foreground shadow-md">
      <div className="flex items-center justify-between w-full h-12 sm:h-auto">
        <Link to="/home" className="text-xl font-bold">
          BuskersHub
        </Link>

        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <SearchMobilePopover />
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profilo
                </DropdownMenuItem>

                {/* Sezione dinamica: artista vs customer */}
                {user?.role === "artist" ? (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/artist">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard artista
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <CustomerRequestsModal />
                )}

                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" /> Tema chiaro
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" /> Tema scuro
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Impostazioni (coming soon)
                </DropdownMenuItem>

                <DropdownMenuItem disabled>
                  Wishlist (coming soon)
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={(e) => e.preventDefault()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Vuoi davvero uscire?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Verrai disconnesso dal tuo account <strong>{user?.role}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Conferma logout</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user?.role === "artist" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/dashboard/artist">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/artist/shows">Spettacoli</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/artist/packages">Pacchetti</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/artist/projects">Progetti</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/artist/calendar">Calendario</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dashboard/artist/settings">Tema</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Search desktop visibile solo da md in su */}
      {["/home"].includes(location.pathname) && (
        <div className="hidden md:flex w-full justify-center mt-4">
          <SearchBar />
        </div>
      )}
    </header>
  )
}

export default Navbar
