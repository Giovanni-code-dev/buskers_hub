const ImageModal = ({ images, selectedIndex, setSelectedIndex }) => {
    if (selectedIndex === null) return null
  
    const close = () => setSelectedIndex(null)
    const prev = () => setSelectedIndex((i) => Math.max(i - 1, 0))
    const next = () => setSelectedIndex((i) => Math.min(i + 1, images.length - 1))
  
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
        onClick={close}
      >
        <div
          className="relative max-w-[90%] max-h-[90%] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bottone X */}
          <button
            onClick={close}
            className="absolute top-2 right-2 text-white text-2xl font-bold z-10"
          >
            ×
          </button>
  
          {/* Freccia sinistra */}
          {selectedIndex > 0 && (
            <button
              onClick={prev}
              className="absolute left-2 text-white text-3xl z-10"
            >
              ❮
            </button>
          )}
  
          {/* Immagine */}
          <img
            src={images[selectedIndex]?.url}
            alt="zoom"
            className="max-h-[80vh] rounded shadow-xl border-4 border-white"
          />
  
          {/* Freccia destra */}
          {selectedIndex < images.length - 1 && (
            <button
              onClick={next}
              className="absolute right-2 text-white text-3xl z-10"
            >
              ❯
            </button>
          )}
        </div>
      </div>
    )
  }
  
  export default ImageModal
  