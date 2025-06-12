import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import ArtistProfileCard from "./components/ArtistProfileCard"
import ContentTabs from "./components/ContentTabs"
import ImageModal from "./components/ImageModal"

const ArtistPublicPage = () => {
  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [shows, setShows] = useState([])
  const [packages, setPackages] = useState([])
  const [projects, setProjects] = useState([])

  const [showImages, setShowImages] = useState([])
  const [packageImages, setPackageImages] = useState([])
  const [projectImages, setProjectImages] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [selectedImageGroup, setSelectedImageGroup] = useState("")

  const [loading, setLoading] = useState(true)

console.log(" Caricamento oggetto artist:", artist )

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [artistRes, showsRes, packagesRes, projectsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/public/${id}`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/artist/${id}`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/packages/artist/${id}`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/artist/${id}`)
        ])

        const [artistData, showsData, packagesData, projectsData] = await Promise.all([
          artistRes.json(),
          showsRes.json(),
          packagesRes.json(),
          projectsRes.json()
        ])

        setArtist(artistData)
        setShows(showsData)
        setPackages(packagesData)
        setProjects(projectsData)

        setShowImages(showsData.flatMap(s => s.images || []))
        setPackageImages(packagesData.flatMap(p => p.images || []))
        setProjectImages(projectsData.flatMap(prj => prj.images || []))
      } catch (error) {
        console.error("Errore nel caricamento:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  if (loading || !artist) {
    
    return (
      <div className="flex justify-center mt-20">
        <Skeleton className="w-[300px] h-[400px]" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-10 max-w-6xl mx-auto">
      {/* PROFILO */}
      <ArtistProfileCard artist={artist} />

      

      {/* CONTENUTO A TABS */}
      <ContentTabs
        shows={shows}
        packages={packages}
        projects={projects}
        showImages={showImages}
        packageImages={packageImages}
        projectImages={projectImages}
        onImageClick={(index, group) => {
          setSelectedImageIndex(index)
          setSelectedImageGroup(group)
        }}
      />

      {/* MODALE IMMAGINE */}
      <ImageModal
        images={
          selectedImageGroup === "shows"
            ? showImages
            : selectedImageGroup === "packages"
            ? packageImages
            : selectedImageGroup === "projects"
            ? projectImages
            : []
        }
        selectedIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        setSelectedIndex={setSelectedImageIndex}
      />
    </div>
  )
}

export default ArtistPublicPage
