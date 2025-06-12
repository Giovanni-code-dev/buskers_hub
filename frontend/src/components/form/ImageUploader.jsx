import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

/**
 * ImageUploader
 *
 * Props:
 * - files: array di File
 * - setFiles: funzione per aggiornare lo stato delle immagini
 */

const ImageUploader = ({ files, setFiles }) => {
  const fileInputRef = useRef(null)

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files || [])
    const uniqueFiles = [...files, ...newFiles]
    setFiles(uniqueFiles)
  }

  const handleRemove = (index) => {
    const updated = [...files]
    updated.splice(index, 1)
    setFiles(updated)
  }

  return (
    <div className="space-y-2">
      <Label>Immagini</Label>
      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
        Aggiungi immagini
      </Button>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFilesChange}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-full h-32 object-cover rounded border shadow"
              />
              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {index === 0 ? "Copertina" : `#${index + 1}`}
              </div>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 opacity-80 group-hover:opacity-100"
                onClick={() => handleRemove(index)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
