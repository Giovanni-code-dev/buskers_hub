import mongoose from "mongoose"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import Artist from "../models/Artist.js"
import Category from "../models/Category.js"

dotenv.config()
const MONGO_URI = process.env.MONGO_URI

// Bio casuali
const bios = [
  "Artista visionario con uno stile unico e coinvolgente.",
  "Porto in scena emozioni, colori e stupore.",
  "Coinvolgo il pubblico con performance immersive e sorprendenti.",
  "Dedicato all’arte performativa in tutte le sue forme.",
  "Mescolo tradizione e sperimentazione in ogni spettacolo.",
]

// Social fake
const generateFakeLinks = (slug) => ({
  instagram: `https://instagram.com/${slug}`,
  facebook: `https://facebook.com/${slug}`,
  youtube: `https://youtube.com/@${slug}`,
  website: `https://www.${slug}.art`,
  portfolio: `https://www.${slug}.art/portfolio`,
  tiktok: `https://www.tiktok.com/@${slug}`,
})

// Nomi fittizi ispirati alle categorie
const artistNames = [
  "Aurora Flame",       // fuoco
  "Giò Giocoliere",     // giocoleria
  "Mimo Silenzio",      // mimo
  "Sky Dancer",         // danza aerea
  "Stilto Alto",        // trampoli
  "Bubble Queen",       // bolle di sapone
  "Pulcinella Clown",   // clown
  "Ombra Figura",       // teatro di figura
  "Fuocone",            // fuoco
  "Capitan Bollicina",  // bolle di sapone
  "Trampolino Max",     // trampoli
  "Lady Acrobatika",    // acrobazia
  "Clown Pastello",     // clown
  "Giò Color",          // giocoleria
  "Air Sybil",          // danza aerea
  "Mimosa Bianca",      // mimo
  "Fiammetta",          // fuoco
  "Giocolibro",         // giocoleria
  "Stella Acro",        // acrobazia
  "Volaria",            // danza aerea
  "Silenzio d'Ombra",   // teatro di figura
  "Spark Tramp",        // trampoli
  "Bollicina Boom",     // bolle di sapone
  "Mr. Maschera",       // mimo
  "Picchio Clown",      // clown
  "Teatrino Vagabondo", // teatro di figura
  "Fire Jack",          // fuoco
  "DanzaBlu",           // danza aerea
  "Mister Bounce",      // trampoli
  "Jolly Show"          // altro
]

const cities = ["Roma", "Milano", "Firenze", "Bologna", "Napoli", "Torino", "Palermo", "Genova", "Verona", "Catania"]

const seedArtists = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("✅ Connessione al DB riuscita")

    const categories = await Category.find()
    if (categories.length === 0) throw new Error("⚠️ Nessuna categoria trovata!")

    await Artist.deleteMany()
    console.log("🧹 Artisti eliminati")

    for (let i = 0; i < 30; i++) {
      const name = artistNames[i % artistNames.length]
      const slug = name.toLowerCase().replace(/\s+/g, "_")
      const email = `artista${i}@example.com`
      const password = await bcrypt.hash("password123", 10)
      const bio = bios[Math.floor(Math.random() * bios.length)]
      const city = cities[i % cities.length]
      const address = `Via degli Artisti ${i}`
      const telefono = `+39 3${Math.floor(100000000 + Math.random() * 899999999)}`

      const shuffled = [...categories].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 1 + Math.floor(Math.random() * 2))

      const newArtist = new Artist({
        email,
        password,
        name,
        provider: "local",
        bio,
        telefono,
        avatar: `https://picsum.photos/300/300?random=${i}`, // avatar fittizio
        location: {
          city,
          address,
          coordinates: {
            lat: (Math.random() * 10 + 40).toFixed(5),
            lng: (Math.random() * 10 + 10).toFixed(5),
          },
        },
        categories: selected.map((c) => c._id),
        ...generateFakeLinks(slug),
      })

      await newArtist.save()
      console.log(`🎭 Artista ${name} inserito`)
    }

    console.log("🎉 Seed completato: 30 artisti inseriti")
    process.exit()
  } catch (error) {
    console.error("❌ Errore:", error)
    process.exit(1)
  }
}

seedArtists()
