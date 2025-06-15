import { X, ChevronLeft, ChevronRight } from "lucide-react"

const ImageModal = ({ images, selectedIndex, setSelectedIndex }) => {
  if (selectedIndex === null) return null

  const close = () => setSelectedIndex(null)
  const prev = () => setSelectedIndex((i) => Math.max(i - 1, 0))
  const next = () => setSelectedIndex((i) => Math.min(i + 1, images.length - 1))

  return (
    <div
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center"
      onClick={close}
    >
      <div
        className="relative max-w-[90%] max-h-[90%] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
        >
          <X className="w-4 h-4" />
        </button>



        {selectedIndex > 0 && (
          <button
            onClick={prev}
            className="absolute left-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}



        <img
          src={images[selectedIndex]?.url}
          alt="zoom"
          className="max-h-[80vh] rounded shadow-xl border-4 border-border"
        />

        {selectedIndex < images.length - 1 && (
          <button
            onClick={next}
            className="absolute right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  )
}

export default ImageModal
