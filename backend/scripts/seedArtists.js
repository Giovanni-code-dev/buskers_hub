import mongoose from "mongoose"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import fetch from "node-fetch"
import Artist from "../models/Artist.js"
import Category from "../models/Category.js"
import cloudinary from "../config/cloudinary.js"

dotenv.config()
const MONGO_URI = process.env.MONGO_URI

// 🔠 Mappa categoria → nome artista fittizio
const categoryNameMap = {
  clown: "Clown Pastello",
  "danza aerea": "Air Sybil",
  mimo: "Mimo Silenzio",
  acrobazia: "Lady Acrobatika",
  trampoli: "Trampolino Max",
  "teatro di figura": "Ombra Figura",
  fuoco: "Fiammetta",
  "bolle di sapone": "Bubble Queen",
}

// ✍️ Biografie
const bios = [
  "Artista visionario con uno stile unico e coinvolgente.",
  "Porto in scena emozioni, colori e stupore.",
  "Coinvolgo il pubblico con performance immersive e sorprendenti.",
  "Dedicato all’arte performativa in tutte le sue forme.",
  "Mescolo tradizione e sperimentazione in ogni spettacolo.",
]

const cities = ["Roma", "Milano", "Firenze", "Bologna", "Napoli", "Torino", "Palermo", "Genova"]

const generateFakeLinks = (slug) => ({
  instagram: `https://instagram.com/${slug}`,
  facebook: `https://facebook.com/${slug}`,
  youtube: `https://youtube.com/@${slug}`,
  website: `https://www.${slug}.art`,
  portfolio: `https://www.${slug}.art/portfolio`,
  tiktok: `https://www.tiktok.com/@${slug}`,
})

// 🖼️ Pexels + Cloudinary upload
const uploadAvatarFromPexels = async (categoryName) => {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(categoryName)} artist&per_page=5`, {
      headers: { Authorization: process.env.PEXELS_API_KEY },
    })

    const data = await res.json()
    const photos = data.photos || []
    if (photos.length === 0) return null

    const randomPhoto = photos[Math.floor(Math.random() * photos.length)]
    const imageUrl = randomPhoto.src.medium

    const imageRes = await fetch(imageUrl)
    const arrayBuffer = await imageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result.secure_url)
        }
      )
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error(`⚠️ Errore upload immagine per ${categoryName}:`, error.message)
    return null
  }
}

const seedArtists = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("✅ Connessione al DB riuscita")

    const allCategories = await Category.find()
    const categories = allCategories.filter(
      (c) => c.name !== "altro" && c.name !== "giocoleria"
    )

    if (categories.length !== 8) {
      throw new Error(`❌ Attese 8 categorie valide, trovate: ${categories.length}`)
    }

    await Artist.deleteMany()
    console.log("🧹 Artisti eliminati")

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      const name = categoryNameMap[cat.name] || `Artista ${cat.name}`
      const slug = name.toLowerCase().replace(/\s+/g, "_")
      const email = `artista_${slug}@example.com`
      const password = await bcrypt.hash("password123", 10)
      const bio = bios[Math.floor(Math.random() * bios.length)]
      const city = cities[i % cities.length]
      const address = `Via degli Artisti ${i}`
      const telefono = `+39 3${Math.floor(100000000 + Math.random() * 899999999)}`

      // 👇 Delay per evitare blocchi Pexels (rate limit)
      await new Promise((r) => setTimeout(r, 1000))
      const avatar = await uploadAvatarFromPexels(cat.name) || `https://picsum.photos/300/300?random=${i}`

      const newArtist = new Artist({
        email,
        password,
        name,
        provider: "local",
        bio,
        telefono,
        avatar,
        location: {
          city,
          address,
          coordinates: {
            lat: (Math.random() * 10 + 40).toFixed(5),
            lng: (Math.random() * 10 + 10).toFixed(5),
          },
        },
        categories: [cat._id],
        ...generateFakeLinks(slug),
      })

      await newArtist.save()
      console.log(`🎭 Artista ${name} (${cat.name}) creato`)
    }

    console.log("🎉 Seed completato con 8 artisti realistici 🎨")
    process.exit()
  } catch (error) {
    console.error("❌ Errore:", error)
    process.exit(1)
  }
}

seedArtists()
