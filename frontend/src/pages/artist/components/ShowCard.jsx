import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

const ShowCard = ({ show }) => {
  const navigate = useNavigate()
  const images = show.images || []

  // Trova immagine cover:true oppure prima disponibile
  const coverImage =
    images.find((img) => img?.cover === true) || images[0] || null

  return (
    <Card
      onClick={() => navigate(`/shows/${show._id}`)}
      className="w-full overflow-hidden rounded-xl shadow hover:shadow-lg transition-all border cursor-pointer"
    >
      {/* Immagine sopra */}
      {coverImage && (
        <div className="relative w-full h-52 sm:h-60 md:h-56">
          <img
            src={coverImage.url}
            alt={show.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenuto */}
      <CardContent className="pt-3 pb-4 px-4 space-y-2">
        {/* Titolo */}
        <h3 className="text-sm font-medium truncate">{show.title}</h3>

        {/* Durata */}
        {show.duration && (
          <div className="text-xs text-muted-foreground">
            Durata: {show.duration}
          </div>
        )}

        {/* Categoria */}
        {show.category && (
          <Badge
            variant="outline"
            className="text-[11px] px-2 py-0.5 rounded-full"
          >
            {typeof show.category === "object"
              ? show.category.name
              : String(show.category)}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

export default ShowCard
