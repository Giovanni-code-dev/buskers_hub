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

        {/* Nome */}
        <h1 className="text-2xl font-bold tracking-tight">{artist.name}</h1>
      </CardContent>
    </Card>
  )
}

export default ArtistProfileCard
