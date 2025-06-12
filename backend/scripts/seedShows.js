
// ✅ Seed dinamico Show con immagini caricate su Cloudinary
import mongoose from "mongoose"
import dotenv from "dotenv"
import ShowModel from "../models/Show.js"
import ArtistModel from "../models/Artist.js"
import cloudinary from "../config/cloudinary.js"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { v4 as uuidv4 } from "uuid"

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CATEGORIES = {
  "danza aerea": "6844842114ef0041c1747a80",
  "mimo": "6844842114ef0041c1747a83",
  "acrobazia": "6844842114ef0041c1747a87",
  "clown": "6844842114ef0041c1747a85",
  "altro": "6844842114ef0041c1747a89",
  "trampoli": "6844842114ef0041c1747a81",
  "fuoco": "6844842114ef0041c1747a84",
  "giocoleria": "6844842114ef0041c1747a82",
  "teatro di figura": "6844842114ef0041c1747a88"
}

const CATEGORY_DATA = {
  "danza aerea": {
    titles: ["Sospesi nel Vento", "Luce e Gravità", "Volteggi d’Aria"],
    descriptions: [
      "Uno spettacolo etereo di danza sospesa tra sogno e realtà.",
      "Un viaggio emozionante tra luci e figure che sfidano la gravità.",
      "Un’esibizione poetica che unisce tecnica e leggerezza."
    ],
    pexelsQuery: "aerial dance"
  },
  "trampoli": {
    titles: ["Passi Giganti", "Tra le Nuvole", "Giochi d’Altezza"],
    descriptions: [
      "Spettacolo su trampoli che incanta grandi e piccini.",
      "Artisti svettano tra le nuvole con eleganza e ritmo.",
      "Un mix di comicità e abilità su trampoli colorati."
    ],
    pexelsQuery: "stilts"
  },
  "giocoleria": {
    titles: ["Ritmo e Rotazione", "Sfere di Luce", "Lancio Magico"],
    descriptions: [
      "Un’esplosione di colore, ritmo e precisione acrobatica.",
      "Giocolieri incantano il pubblico con sfere luminose e movenze fluide.",
      "Tra torce e clave, ogni lancio è pura magia."
    ],
    pexelsQuery: "juggling"
  },
  "mimo": {
    titles: ["Silenzio In Scena", "Il Racconto Invisibile", "Occhi che Parlano"],
    descriptions: [
      "Un viaggio senza parole fatto di emozioni forti.",
      "Mimo poetico che narra storie universali senza voce.",
      "Espressioni e gesti che commuovono e fanno sorridere."
    ],
    pexelsQuery: "mime"
  },
  "fuoco": {
    titles: ["Fiamme in Danza", "Cerchio di Fuoco", "Alchimia Ardente"],
    descriptions: [
      "Un rito tribale che accende la notte con danza e fuoco.",
      "Artisti domano le fiamme in uno spettacolo mozzafiato.",
      "Movimenti ipnotici tra scintille e braci."
    ],
    pexelsQuery: "fire performance"
  },
  "altro": {
    titles: ["Sogni Itineranti", "Spettacolo Onirico", "Arte di Strada Viva"],
    descriptions: [
      "Una performance ibrida che mescola generi e suggestioni.",
      "Teatro, musica e improvvisazione per sorprendere ogni pubblico.",
      "Lo spettacolo prende vita in ogni angolo della città."
    ],
    pexelsQuery: "street performance"
  },
  "acrobazia": {
    titles: ["Corpi in Equilibrio", "Verticali Estreme", "Slanci e Cadute"],
    descriptions: [
      "Atleti e artisti mostrano il massimo controllo e forza.",
      "Una sfida alla gravità con figure spettacolari.",
      "Acrobazie mozzafiato che sfidano i limiti umani."
    ],
    pexelsQuery: "acrobatics"
  },
  "clown": {
    titles: ["Risate a Colori", "Naso Rosso Show", "Il Gioco del Buffone"],
    descriptions: [
      "Comicità intelligente e giochi visuali per tutte le età.",
      "Un clown poetico che diverte e commuove.",
      "Sketch comici e gag in stile circo contemporaneo."
    ],
    pexelsQuery: "clown"
  },
  "teatro di figura": {
    titles: ["Burattini all’Opera", "Ombre e Magie", "Il Mondo dei Pupazzi"],
    descriptions: [
      "Marionette prendono vita tra storie e melodie.",
      "Teatro d’ombre che incanta con suggestioni visive.",
      "Un racconto animato per grandi e piccini."
    ],
    pexelsQuery: "puppetry"
  }
}

const downloadImage = async (url, filename) => {
  const res = await fetch(url)
  const buffer = await res.buffer()
  const filePath = path.join(__dirname, filename)
  fs.writeFileSync(filePath, buffer)
  return filePath
}

const uploadToCloudinary = async (localPath, folder) => {
  const res = await cloudinary.uploader.upload(localPath, {
    folder,
  })
  fs.unlinkSync(localPath)
  return res
}

const seedShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connessione al DB riuscita!")

    await ShowModel.deleteMany()
    console.log("🧹 Show precedenti rimossi")

    const artists = await ArtistModel.find()
    if (artists.length === 0) throw new Error("Nessun artista trovato")

    for (const artist of artists) {
      const categories = artist.categories.map(id =>
        Object.keys(CATEGORIES).find(k => CATEGORIES[k] === id.toString())
      )
      if (!categories.length) continue

      const chosenCategory = categories[Math.floor(Math.random() * categories.length)]
      const catData = CATEGORY_DATA[chosenCategory]

      const title = catData.titles[Math.floor(Math.random() * catData.titles.length)]
      const description = catData.descriptions[Math.floor(Math.random() * catData.descriptions.length)]

      const images = []
      for (let i = 0; i < 5; i++) {
        const imgUrl = `https://source.unsplash.com/800x600/?${catData.pexelsQuery}&sig=${uuidv4()}`
        const local = await downloadImage(imgUrl, `temp_${uuidv4()}.jpg`)
        const uploaded = await uploadToCloudinary(local, "shows")
        images.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
          isCover: i === 0
        })
      }

      const newShow = new ShowModel({
        title,
        description,
        category: chosenCategory,
        durationMinutes: 30 + Math.floor(Math.random() * 30),
        images,
        artist: artist._id
      })

      await newShow.save()
      console.log(`🎭 Creato show “${title}” per artista ${artist.name} nella categoria ${chosenCategory}`)
    }

    console.log("✅ Seed completato!")
    process.exit()
  } catch (err) {
    console.error("❌ Errore durante il seed:", err)
    process.exit(1)
  }
}

seedShows()