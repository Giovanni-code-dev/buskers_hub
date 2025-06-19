import { useEffect, useRef, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef(null)

  if (!images || images.length === 0) return null

  // 🔁 Autoplay
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(intervalRef.current)
  }, [images.length])

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-0">
      <Carousel className="w-full overflow-hidden">
        <CarouselContent
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.6s ease-in-out",
            display: "flex",
          }}
        >
          {images.map((img, index) => (
            <CarouselItem
              key={img.public_id || index}
              className="min-w-full shrink-0"
            >
              <img
                src={img.url}
                alt={`Immagine ${index + 1}`}
                className="rounded-xl w-full h-[380px] object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          onClick={() =>
            setCurrentIndex((currentIndex - 1 + images.length) % images.length)
          }
          className="left-2 sm:left-4 z-10"
        />
        <CarouselNext
          onClick={() =>
            setCurrentIndex((currentIndex + 1) % images.length)
          }
          className="right-2 sm:right-4 z-10"
        />
      </Carousel>

      {/* Indicatori */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
