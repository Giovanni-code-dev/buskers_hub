import mongoose from "mongoose"
import dotenv from "dotenv"
import Artist from "../models/Artist.js"
import Show from "../models/Show.js"
import Category from "../models/Category.js" 

dotenv.config()

// Descrizioni e titoli poetici per ogni categoria
const SHOW_PRESETS = {
  clown: [
    {
      title: "Risate a Colori",
      description: "Un viaggio tra risate e magia, dove ogni trucco è un'emozione.",
    },
    {
      title: "Il Circo del Cuore",
      description: "Un cuore rosso e un naso buffo per raccontare storie senza parole.",
    },
    {
      title: "Clowneria Poetica",
      description: "Gesti teneri e risate gentili per incantare grandi e piccoli.",
    },
  ],
  trampoli: [
    {
      title: "I Giganti in Festa",
      description: "Passi altissimi e sorrisi enormi che conquistano il cielo.",
    },
    {
      title: "Camminando tra le Nuvole",
      description: "Uno spettacolo sospeso, dove i sogni si fanno alti.",
    },
    {
      title: "La Parata degli Alti Spiriti",
      description: "Trampolieri festosi che danzano con leggerezza sul mondo.",
    },
  ],
  fuoco: [
    {
      title: "Fiamme nel Vento",
      description: "Una danza ardente che accende l'anima e illumina la notte.",
    },
    {
      title: "Cuore Infiammato",
      description: "Un vortice di scintille che racconta passione e potere.",
    },
    {
      title: "Rituale del Fuoco",
      description: "Antichi movimenti e calore primordiale in scena.",
    },
  ],
  "teatro di figura": [
    {
      title: "Ombre Parlanti",
      description: "Sagome misteriose che raccontano mondi lontani.",
    },
    {
      title: "Burattini Sognanti",
      description: "Piccoli protagonisti animati da emozioni vere.",
    },
    {
      title: "Fantasmi di Carta",
      description: "Un viaggio teatrale tra poesia, legno e magia.",
    },
  ],
}

// Solo queste categorie sono valide
const ALLOWED_CATEGORIES = Object.keys(SHOW_PRESETS)

const seedShows = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connesso al DB")

    const artists = await Artist.find().populate("categories")
    console.log(`🎭 Artisti trovati: ${artists.length}`)

    await Show.deleteMany()
    console.log("🧹 Show esistenti eliminati")

    for (const artist of artists) {
      const validCategory = artist.categories.find((cat) =>
        ALLOWED_CATEGORIES.includes(cat.name)
      )
      if (!validCategory) {
        console.log(`⏭️  ${artist.name} ha solo categorie escluse, salto...`)
        continue
      }

      const category = validCategory.name
      const presets = SHOW_PRESETS[category]

      const shows = presets.map((preset) => ({
        title: preset.title,
        description: preset.description,
        category,
        artist: artist._id,
        durationMinutes: 30 + Math.floor(Math.random() * 31), // da 30 a 60
        images: [],
      }))

      await Show.insertMany(shows)
      console.log(`✨ Creati ${shows.length} show per ${artist.name} (categoria: ${category})`)
    }

    console.log("✅ Seed completato con successo!")
    process.exit()
  } catch (err) {
    console.error("❌ Errore durante il seed:", err)
    process.exit(1)
  }
}

seedShows()
