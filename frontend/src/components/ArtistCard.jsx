import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const ArtistCard = ({ artist }) => {
  const primaryColor = artist.theme?.primaryColor || "#e0e0e0"
  const backgroundColor = artist.theme?.backgroundColor || "#ffffff"
  const fontFamily = artist.theme?.fontFamily || "inherit"

  return (
    <div className="transform transition-transform duration-500 hover:scale-105 hover:z-10">
      <Card
        className="shadow-lg hover:shadow-xl transition-all border-2 h-full flex flex-col"
        style={{
          borderColor: primaryColor,
          backgroundColor,
          fontFamily
        }}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="space-y-3">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4"
              style={{ borderColor: primaryColor }}
            />
<div className="text-center space-y-1">
  <h3 className="text-lg font-semibold truncate sm:text-base">
    {artist.name}
  </h3>

  {artist.categories?.length > 0 && (
    <p className="text-xs text-muted-foreground ">
      {artist.categories.map((cat) =>
        typeof cat === "object" && cat.name ? cat.name : String(cat)
      ).join(", ")}
    </p>
  )}

  {(artist.city || artist.location?.city) && (
    <p className="text-xs ">

      {artist.city || artist.location.city}
    </p>
  )}
</div>
          </div>

          <div className="text-center mt-4">
            <Button asChild className="w-full">
              <Link to={`/artist/${artist._id}`}>Scopri di più</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ArtistCard
