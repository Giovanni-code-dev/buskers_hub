import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const ArtistCard = ({ artist }) => {
  const primaryColor = artist.theme?.primaryColor || "#e0e0e0"
  const backgroundColor = artist.theme?.backgroundColor || "#ffffff"
  const fontFamily = artist.theme?.fontFamily || "inherit"

  return (
    <div className="transform transition-transform duration-500 hover:scale-125 hover:z-10">
      <Card
        className="shadow-lg hover:shadow-xl transition-all border-2"
        style={{
          borderColor: primaryColor,
          backgroundColor,
          fontFamily
        }}
      >
        <CardContent className="p-4 space-y-3">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4"
            style={{ borderColor: primaryColor }}
          />
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold">{artist.name}</h3>
            {artist.categories?.length > 0 && (
  <p className="text-sm text-muted-foreground">
    {artist.categories.map((cat) =>
      typeof cat === "object" && cat.name ? cat.name : String(cat)
    ).join(", ")}
  </p>


            )}
          </div>
          <div className="text-center">
            <Button asChild className="mt-2">
              <Link to={`/artist/${artist._id}`}> Scopri di più</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ArtistCard
