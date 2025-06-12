import { NavLink, Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { useUser } from "@/contexts/UserContext"

const LayoutArtist = () => {
  const { user } = useUser()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar desktop sticky sotto la navbar */}
        <aside className="w-64 bg-muted text-muted-foreground p-4 space-y-6 shadow-md hidden md:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <h2 className="text-2xl font-bold text-foreground">Area Artista</h2>

          <nav className="space-y-2">
            <NavLink to="/dashboard/artist" end className={navStyle}>Dashboard</NavLink>
            <NavLink to="/dashboard/artist/shows" className={navStyle}>Spettacoli</NavLink>
            <NavLink to="/dashboard/artist/requests" className={navStyle}>Richieste ricevute</NavLink>
            <NavLink to="/dashboard/artist/packages" className={navStyle}>Pacchetti</NavLink>
            <NavLink to="/dashboard/artist/projects" className={navStyle}>Progetti</NavLink>
            <NavLink to="/dashboard/artist/calendar" className={navStyle}>Calendario</NavLink>
            <NavLink to="/dashboard/artist/settings" className={navStyle}>Tema</NavLink>
            <NavLink to="/dashboard/artist/edit-profile" className={navStyle}>Modifica profilo</NavLink> {/* ✅ Nuova voce */}
          </nav>

          <div className="mt-10 text-sm text-muted-foreground">{user?.name}</div>
        </aside>

        {/* Contenuto centrale con altezza adattata alla navbar */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const navStyle = ({ isActive }) =>
  `block transition-all hover:text-primary ${isActive ? "font-bold underline text-primary" : ""}`

export default LayoutArtist
