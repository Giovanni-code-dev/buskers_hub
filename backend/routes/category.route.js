import express from "express"
import CategoryModel from "../models/Category.js"

const router = express.Router()

// Rotta pubblica per SearchBar
router.get("/", async (req, res, next) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 })
    console.log("✅ Categories inviate:", categories) // <--- Aggiungi questo

    res.json(categories) // restituisce array di oggetti con _id e name
  } catch (error) {
    next(error)
  }
})

// Rotta privata per CRUD categorie (solo admin)
router.post("/", async (req, res, next) => {
    try {
      const data = Array.isArray(req.body) ? req.body : [req.body]
      const result = await CategoryModel.insertMany(data)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  })
  

export default router
