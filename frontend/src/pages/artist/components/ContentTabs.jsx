import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import CardGrid from "./CardGrid"
import ImageCarousel from "./ImageCarousel"
import SkeletonCard from "@/components/ui/SkeletonCard"
import SkeletonCarousel from "@/components/ui/SkeletonCarousel"

const ContentTabs = ({ shows, showImages, artist, onImageClick, categoriesMap }) => {
  // Funzione per ottenere l'URL embed di YouTube
  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:\?v=|\.be\/)([\w-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  const embedUrl = getEmbedUrl(artist?.youtube)

  return (
    <Tabs defaultValue="shows" className="w-full">
      {/* === NAVIGAZIONE TAB === */}
      <TabsList className="flex flex-wrap justify-center gap-2 mb-6">
        <TabsTrigger value="shows">Spettacoli</TabsTrigger>
        <TabsTrigger value="bio">Bio</TabsTrigger>
        <TabsTrigger value="video">Video</TabsTrigger>
      </TabsList>

      {/* === TAB SPETTACOLI === */}
      <TabsContent value="shows">
        <div className="space-y-6">
          {/* Se shows è vuoto, mostra 3 skeleton card */}
          {shows.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
<CardGrid items={shows} type="shows" categoriesMap={categoriesMap} />
          )}

          {/* Skeleton per il carosello immagini */}
          {showImages.length === 0 ? (
            <SkeletonCarousel />
          ) : (
            <ImageCarousel
              images={showImages}
              onImageClick={(i) => onImageClick(i, "shows")}
            />
          )}
        </div>
      </TabsContent>

      {/* === TAB BIO === */}
      <TabsContent value="bio">
        <div className="max-w-3xl mx-auto text-center text-muted-foreground text-sm leading-relaxed px-4">
          {artist?.bio ? (
            <p>{artist.bio}</p>
          ) : (
            <p className="italic">Nessuna biografia disponibile.</p>
          )}
        </div>
      </TabsContent>

      {/* === TAB VIDEO === */}
      <TabsContent value="video">
        <div className="aspect-video max-w-4xl mx-auto px-4">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Video di presentazione"
              className="w-full h-full rounded-xl shadow-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="italic text-center text-muted-foreground text-sm">
              Nessun video disponibile.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default ContentTabs
