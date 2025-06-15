import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ArtistCard from "@/components/ArtistCard"
import { format } from "date-fns"

const shuffleArray = (array) =>
  array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

const HomeCustomer = () => {
  const [filteredArtists, setFilteredArtists] = useState([])
  const [searchParams] = useSearchParams()

  const city = searchParams.get("city")
  const category = searchParams.get("category")
  const date = searchParams.get("date")

  useEffect(() => {
    const fetchArtists = async () => {
      const params = new URLSearchParams()
      if (city) params.set("city", city)
      if (category) params.set("category", category)
      if (date) params.set("date", date)

      const url = `${import.meta.env.VITE_BACKEND_URL}/artist/public?${params.toString()}`
      console.log(" URL richiesta:", url)

      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Errore HTTP ${res.status}`)
        const data = await res.json()
        console.log(" Artisti ricevuti:", data)
        const shuffled = shuffleArray(data)
        setFilteredArtists(shuffled)
      } catch (error) {
        console.error(" Errore nella fetch artisti:", error)
      }
    }

    fetchArtists()
  }, [city, category, date])

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">


      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))
        ) : (
          <p className="text-center col-span-full text-muted-foreground">
            Nessun artista trovato con questi criteri.
          </p>
        )}
      </div>
    </div>
  )
}

export default HomeCustomer
