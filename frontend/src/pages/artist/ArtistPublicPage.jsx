import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ArtistProfileCard from "./components/ArtistProfileCard"
import ContentTabs from "./components/ContentTabs"
import ImageModal from "./components/ImageModal"
import { Loader2 } from "lucide-react"
import {
  Globe,
  Instagram,
  Facebook,
  Youtube,
  FileDown,
  MapPin,
  Link as LinkIcon,
  Phone,
} from "lucide-react"

const ArtistPublicPage = () => {
  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [shows, setShows] = useState([])
  const [showImages, setShowImages] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [artistRes, showsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/public/${id}`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/artist/${id}`),
        ])

        const [artistData, showsData] = await Promise.all([
          artistRes.json(),
          showsRes.json(),
        ])

        setArtist(artistData)
        setShows(showsData)
        setShowImages(showsData.flatMap((s) => s.images || []))
      } catch (error) {
        console.error("Errore nel caricamento:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  const [categoriesMap, setCategoriesMap] = useState({})

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://buskers-hub.onrender.com/categories")
        const data = await res.json()
        const map = {}
        data.forEach((cat) => {
          map[cat._id] = cat.name
        })
        setCategoriesMap(map)
      } catch (error) {
        console.error("Errore nel caricamento categorie:", error)
      }
    }
  
    fetchCategories()
  }, [])
  

  if (!artist) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Caricamento artista...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 space-y-10 max-w-6xl mx-auto">
      {/* PROFILO ARTISTA */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 max-w-sm">
          <ArtistProfileCard artist={artist} />
        </div>

        {/* DETTAGLI */}
        <div className="flex-1 space-y-4">
          {artist.location?.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {artist.location.city}
            </div>
          )}

          {/* CONTATTI E SOCIAL */}
          <div className="grid grid-cols-1 gap-2 text-sm mt-4">
            {artist.telefono && (
              <a href={`tel:${artist.telefono}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                {artist.telefono}
              </a>
            )}
            {artist.website && (
              <a href={artist.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
                Sito web
              </a>
            )}
            {artist.instagram && (
              <a href={artist.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            )}
            {artist.facebook && (
              <a href={artist.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            )}
            {artist.youtube && (
              <a href={artist.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Youtube className="w-4 h-4" />
                YouTube
              </a>
            )}
            {artist.tiktok && (
              <a href={artist.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <LinkIcon className="w-4 h-4" />
                TikTok
              </a>
            )}
            {artist.portfolio && (
              <a href={artist.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <FileDown className="w-4 h-4" />
                Portfolio
              </a>
            )}
{artist.categories?.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {artist.categories.map((catId) => {
      const id = typeof catId === "object" ? catId._id : catId
      const name = typeof catId === "object" && catId.name
        ? catId.name
        : categoriesMap[id] || "Categoria sconosciuta"
      return (
        <span
          key={id}
          className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
        >
          {name}
        </span>
      )
    })}
  </div>
)}

          </div>
        </div>
      </div>

      {/* LOADING SECONDARIO */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Caricamento contenuti artistici...</p>
        </div>
      ) : (
        <>
          {/* CONTENUTO TABS */}
          <ContentTabs
            shows={shows}
            showImages={showImages}
            artist={artist}
            categoriesMap={categoriesMap}
            onImageClick={(index) => setSelectedImageIndex(index)}
          />

          {/* MODALE IMMAGINE */}
          <ImageModal
            images={showImages}
            selectedIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            setSelectedIndex={setSelectedImageIndex}
          />
        </>
      )}
    </div>
  )
}

export default ArtistPublicPage
