const ImageCarousel = ({ images, onImageClick }) => {
    return (
      <div className="overflow-x-auto flex gap-3 py-3">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt={`immagine-${i}`}
            onClick={() => onImageClick(i)}
            className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 object-cover rounded-md shadow-md cursor-pointer flex-shrink-0"
          />
        ))}
      </div>
    )
  }
  
  
  export default ImageCarousel
  