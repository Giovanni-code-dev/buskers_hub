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
import { Card, CardContent } from "@/components/ui/card"

const ArtistProfileCard = ({ artist }) => {
  const primaryColor = artist.theme?.primaryColor || "#e0e0e0"
  const backgroundColor = artist.theme?.backgroundColor || "#ffffff"
  const fontFamily = artist.theme?.fontFamily || "inherit"

  return (
    <Card
      className="border-2 shadow-xl transition-all duration-300"
      style={{ borderColor: primaryColor, backgroundColor, fontFamily }}
    >
      <CardContent className="p-6 text-center space-y-5">
        {/* Avatar */}
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-32 h-32 mx-auto rounded-full object-cover border-4"
          style={{ borderColor: primaryColor }}
        />

        {/* Nome e bio */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{artist.name}</h1>
          {artist.bio && (
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              {artist.bio}
            </p>
          )}
        </div>

        {/* Categorie */}
        {artist.categories?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            {artist.categories.map((cat) => (
              <span
                className="bg-primary/10 text-primary px-3 py-1 rounded-full"
                key={typeof cat === "object" ? cat._id : cat}
              >
                {typeof cat === "object" && cat.name ? cat.name : String(cat)}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div>
          {artist.averageRating ? (
            <p className="text-yellow-600 font-medium">
              {artist.averageRating} su {artist.reviewCount} recensioni
            </p>
          ) : (
            <p className="text-muted-foreground italic">Nessuna recensione</p>
          )}
        </div>

        {/* Posizione */}
        {artist.location?.city && (
          <div className="flex justify-center items-center gap-2 text-muted-foreground mt-2">
            <MapPin className="w-4 h-4" />
            <span>{artist.location.city}</span>
          </div>
        )}

        {/* Contatti e Social */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-sm justify-items-center">
          {artist.telefono && (
            <a href={`tel:${artist.telefono}`} className="flex items-center gap-1 underline">
              <Phone className="w-4 h-4" /> {artist.telefono}
            </a>
          )}
          {artist.website && (
            <a href={artist.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              <Globe className="w-4 h-4" /> 
            </a>
          )}
          {artist.instagram && (
            <a href={artist.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              <Instagram className="w-4 h-4" /> 
            </a>
          )}
          {artist.facebook && (
            <a href={artist.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {artist.youtube && (
            <a href={artist.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              <Youtube className="w-4 h-4" /> 
            </a>
          )}
          {artist.tiktok && (
            <a href={artist.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              <LinkIcon className="w-4 h-4" /> 
            </a>
          )}
          {artist.portfolio && (
            <a href={artist.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
              <FileDown className="w-4 h-4" /> 
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ArtistProfileCard
