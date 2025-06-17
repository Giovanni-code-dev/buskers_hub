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
      className="border-2 shadow-xl rounded-2xl transition-colors"
      style={{ borderColor: primaryColor, backgroundColor, fontFamily }}
    >
      <CardContent className="p-6 text-center space-y-4">
        {/* Avatar */}
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-32 h-32 mx-auto rounded-full object-cover border-4 shadow-md"
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
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
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
            <p className="text-yellow-600 font-semibold text-sm">
              {artist.averageRating} su {artist.reviewCount} recensioni
            </p>
          ) : (
            <p className="text-muted-foreground italic"></p>
          )}
        </div>

        {/* Posizione */}
        {artist.location?.city && (
          <div className="flex justify-center items-center gap-2 text-muted-foreground mt-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{artist.location.city}</span>
          </div>
        )}

        {/* Contatti e Social */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-sm justify-items-center">
          {artist.telefono && (
            <a href={`tel:${artist.telefono}`} className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> {artist.telefono}
            </a>
          )}
          {artist.website && (
            <a href={artist.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          )}
          {artist.instagram && (
            <a href={artist.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {artist.facebook && (
            <a href={artist.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {artist.youtube && (
            <a href={artist.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          )}
          {artist.tiktok && (
            <a href={artist.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <LinkIcon className="w-4 h-4" />
            </a>
          )}
          {artist.portfolio && (
            <a href={artist.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline hover:text-primary transition-colors">
              <FileDown className="w-4 h-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ArtistProfileCard
