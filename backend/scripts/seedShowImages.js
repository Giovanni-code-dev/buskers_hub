// scripts/seedShowImages.js
import mongoose from "mongoose"
import dotenv from "dotenv"
import { createClient } from "pexels"
import fetch from "node-fetch"
import cloudinary from "../config/cloudinary.js"
import Show from "../models/Show.js"

dotenv.config()

const pexelsClient = createClient(process.env.PEXELS_API_KEY)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 🔁 Traduzione categorie ITA → ENG per miglior ricerca su Pexels
const categoryMap = {
  "danza aerea": "aerial dance",
  "acrobazia": "acrobatics",
  "mimo": "mime",
  "clown": "clown performance",
  "bolle di sapone": "bubble show",
  "trampoli": "stilt walker",
  "fuoco": "fire performance",
  "teatro di figura": "puppet theatre"
}

const getImagesFromPexels = async (query) => {
  try {
    const res = await pexelsClient.photos.search({ query, per_page: 5 })
    return res.photos || []
  } catch (error) {
    console.error(`❌ Errore Pexels per '${query}':`, error.message)
    return []
  }
}

const uploadToCloudinary = async (url, folder = "shows") => {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      stream.end(buffer)
    })
  } catch (err) {
    console.error("❌ Upload fallito:", err.message)
    return null
  }
}

const seedImagesForShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connesso al DB")

    const shows = await Show.find()
    console.log(`🎭 Show trovati: ${shows.length}`)

    const usedUrls = new Set()

    for (const show of shows) {
      const query = categoryMap[show.category?.toLowerCase()] || show.category
      console.log(`🔍 '${show.title}' → categoria tradotta: "${query}"`)
      await delay(1500)

      // 🧹 Svuota immagini esistenti
      show.images = []

      const images = await getImagesFromPexels(query)
      const freshImages = images.filter(img => !usedUrls.has(img.src.large2x)).slice(0, 3)

      if (freshImages.length === 0) {
        console.warn(`⚠️ Nessuna immagine trovata per '${show.title}'`)
        continue
      }

      const uploaded = []

      for (const [index, image] of freshImages.entries()) {
        const result = await uploadToCloudinary(image.src.large2x)
        if (!result) continue

        usedUrls.add(image.src.large2x)

        uploaded.push({
          url: result.secure_url,
          public_id: result.public_id,
          isCover: index === 0,
        })

        console.log(`📸 Immagine ${index + 1} caricata per '${show.title}'`)
        await delay(1000)
      }

      show.images = uploaded
      await show.save()
      console.log(`✅ Salvate ${uploaded.length} immagini per '${show.title}'`)
    }

    console.log("🎉 Seed immagini completato!")
    process.exit()
  } catch (err) {
    console.error("❌ Errore generale:", err)
    process.exit(1)
  }
}

seedImagesForShows()
