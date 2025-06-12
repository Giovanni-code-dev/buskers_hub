import { useEffect, useState } from "react"
import ArtistCard from "@/components/ArtistCard"

const Home = () => {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/artist`)
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(err => console.error("Errore nel fetch artisti:", err))
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">🌈 Artisti disponibili</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist._id} artist={artist} />
        ))}
      </div>
    </div>
  )
}

export default Home
