import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import CardGrid from "./CardGrid"
  import ImageCarousel from "./ImageCarousel"
  
  const ContentTabs = ({
    shows,
    packages,
    projects,
    showImages,
    packageImages,
    projectImages,
    onImageClick,
  }) => {
    return (
      <Tabs defaultValue="shows" className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-2 mb-6">
          <TabsTrigger value="shows">Spettacoli</TabsTrigger>
          <TabsTrigger value="packages">Pacchetti</TabsTrigger>
          <TabsTrigger value="projects">Progetti</TabsTrigger>
        </TabsList>
  
        {/* === SHOWS === */}
        <TabsContent value="shows">
          <div className="space-y-6">
            <CardGrid items={shows} type="shows" />
            {showImages.length > 0 && (
              <ImageCarousel
                images={showImages}
                onImageClick={(i) => onImageClick(i, "shows")}
              />
            )}
          </div>
        </TabsContent>
  
        {/* === PACKAGES === */}
        <TabsContent value="packages">
          <div className="space-y-6">
            <CardGrid items={packages} type="packages" />
            {packageImages.length > 0 && (
              <ImageCarousel
                images={packageImages}
                onImageClick={(i) => onImageClick(i, "packages")}
              />
            )}
          </div>
        </TabsContent>
  
        {/* === PROJECTS === */}
        <TabsContent value="projects">
          <div className="space-y-6">
            <CardGrid items={projects} type="projects" />
            {projectImages.length > 0 && (
              <ImageCarousel
                images={projectImages}
                onImageClick={(i) => onImageClick(i, "projects")}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    )
  }
  
  export default ContentTabs
  