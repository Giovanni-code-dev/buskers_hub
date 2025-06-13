import mongoose from "mongoose"
import dotenv from "dotenv"
import Artist from "../models/Artist.js"
import Category from "../models/Category.js"

dotenv.config()

const testPopulate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    const artists = await Artist.find().populate("categories")
for (const artist of artists) {
  console.log(`👤 ${artist.name}`)
  console.log("🎨 Categorie:", artist.categories.map(c => c.name))
}
    console.log("🎨 Categorie:", artist.categories)
    process.exit()
  } catch (error) {
    console.error("❌ Errore:", error)
    process.exit(1)
  }
}

testPopulate()