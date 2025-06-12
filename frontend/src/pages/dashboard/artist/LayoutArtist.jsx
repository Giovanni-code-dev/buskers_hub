import { NavLink, Outlet } from "react-router-dom"

const LayoutArtist = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-6">
        <h2 className="text-2xl font-bold">Area Artista</h2>
        <nav className="space-y-2">
        <NavLink
  to="/dashboard/artist/shows"
  className={({ isActive }) => isActive ? "font-bold underline" : ""}
>
  Spettacoli
</NavLink>

<NavLink
  to="/dashboard/artist/requests"
  className={({ isActive }) => isActive ? "font-bold underline" : ""}
>
  Richieste ricevute ✅
</NavLink>

<NavLink
  to="/dashboard/artist/packages"
  className={({ isActive }) => isActive ? "font-bold underline" : ""}
>
  Pacchetti ✅
</NavLink>

<NavLink
  to="/dashboard/artist/projects"
  className={({ isActive }) => isActive ? "font-bold underline" : ""}
>
  Progetti
</NavLink>

<NavLink
  to="/dashboard/artist/settings"
  className={({ isActive }) => isActive ? "font-bold underline" : ""}
>
  Tema
</NavLink>
        </nav>
      </aside>

      {/* Contenuto dinamico */}
      <main className="flex-1 p-6 bg-background text-foreground">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutArtist
