import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"

const ArtistCard = ({ artist }) => {
  const primaryColor = artist.theme?.primaryColor || "#d1d5db"
  const backgroundColor = artist.theme?.backgroundColor || "#ffffff"
  const fontFamily = artist.theme?.fontFamily || "inherit"

  const displayCategories = artist.categories?.slice(0, 2) || []
  const extraCount = artist.categories?.length > 2 ? artist.categories.length - 2 : 0

  return (
    <Link to={`/artist/${artist._id}`} className="block h-full">
      <Card
        className="h-full flex flex-col justify-between overflow-hidden rounded-xl shadow hover:shadow-lg active:scale-[0.98] transition-transform border"
        style={{ backgroundColor, fontFamily }}
      >
        {/* Immagine sopra: altezza fissa, copre tutta la larghezza */}
        <div className="relative w-full h-52 sm:h-60 md:h-56">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenuto testo */}
        <CardContent className="pt-3 pb-4 px-4 space-y-2 flex-1 flex flex-col justify-between">
          {/* Nome */}
          <h3 className="text-sm font-medium truncate hover:underline">
            {artist.name}
          </h3>

          {/* Badge categorie */}
          <div className="flex flex-wrap gap-1">
            {displayCategories.map((cat, index) => (
              <span
                key={index}
                className="bg-muted text-muted-foreground text-[11px] px-2 py-0.5 rounded-full"
              >
                {typeof cat === "object" && cat.name ? cat.name : String(cat)}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-muted-foreground text-xs">+{extraCount}</span>
            )}
          </div>

          {/* Città */}
          {(artist.city || artist.location?.city) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{artist.city || artist.location.city}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default ArtistCard
