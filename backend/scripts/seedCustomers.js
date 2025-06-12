import mongoose from "mongoose"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import Customer from "../models/Customer.js" // ✅ G// Assicurati che il path sia corretto

dotenv.config()

const MONGO_URI = process.env.MONGO_URI 

const seedCustomers = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connessione al DB riuscita!")

    const customers = [
      {
        email: "alice@example.com",
        password: "password123",
        name: "Alice Rossi",
        avatar: "https://i.pravatar.cc/150?img=1",
        bio: "Appassionata di eventi teatrali e performance urbane.",
        telefono: "+39 320 1234567",
        website: "https://alice-portfolio.com",
        instagram: "@alice_artistica",
        facebook: "https://facebook.com/aliceartistica",
        youtube: "https://youtube.com/@aliceeventi",
        portfolio: "https://alice-portfolio.com/showreel",
        tiktok: "@aliceevents",
        categories: ["teatro", "clown"],
        location: {
          city: "Roma",
          address: "Via Appia 12",
          coordinates: { lat: 41.8799, lng: 12.5023 },
        },
      },
      {
        email: "marco@example.com",
        password: "password123",
        name: "Marco Bianchi",
        avatar: "https://i.pravatar.cc/150?img=2",
        bio: "Amo i concerti e gli spettacoli in piazza.",
        telefono: "+39 347 9876543",
        website: "https://marcobianchi.it",
        instagram: "@marcoeventi",
        facebook: "https://facebook.com/marcoeventi",
        youtube: "https://youtube.com/@marcobianchi",
        tiktok: "@marco_b",
        categories: ["musica", "danza"],
        location: {
          city: "Milano",
          address: "Corso Buenos Aires 45",
          coordinates: { lat: 45.4784, lng: 9.2272 },
        },
      },
      {
        email: "elena@example.com",
        password: "password123",
        name: "Elena Verdi",
        avatar: "https://i.pravatar.cc/150?img=3",
        bio: "Organizzatrice di eventi privati e matrimoni.",
        telefono: "+39 345 1122334",
        instagram: "@elenaverdi_eventi",
        categories: ["giocoleria", "fuoco"],
        location: {
          city: "Firenze",
          address: "Piazza del Duomo 5",
          coordinates: { lat: 43.7735, lng: 11.2558 },
        },
      },
      {
        email: "lucagi@example.com",
        password: "password123",
        name: "Luca Giordano",
        avatar: "https://i.pravatar.cc/150?img=4",
        bio: "Lavoro nel settore eventi e booking artistico.",
        telefono: "+39 348 5566778",
        website: "https://lucabooking.com",
        categories: ["trampoli", "danza aerea"],
        location: {
          city: "Napoli",
          address: "Via Toledo 123",
          coordinates: { lat: 40.8484, lng: 14.258 },
        },
      },
      {
        email: "francesca@example.com",
        password: "password123",
        name: "Francesca Lodi",
        avatar: "https://i.pravatar.cc/150?img=5",
        bio: "Event manager per festival di arte urbana.",
        telefono: "+39 331 7890123",
        instagram: "@francyfestival",
        categories: ["clown", "mimo"],
        location: {
          city: "Bologna",
          address: "Via Indipendenza 7",
          coordinates: { lat: 44.4962, lng: 11.3458 },
        },
      },
      {
        email: "giulia@example.com",
        password: "password123",
        name: "Giulia De Angelis",
        avatar: "https://i.pravatar.cc/150?img=6",
        bio: "Cerco artisti per eventi aziendali.",
        telefono: "+39 333 9988776",
        portfolio: "https://giuliada.it/showcases",
        categories: ["danza", "acrobatica"],
        location: {
          city: "Torino",
          address: "Via Po 33",
          coordinates: { lat: 45.0703, lng: 7.6869 },
        },
      },
      {
        email: "davide@example.com",
        password: "password123",
        name: "Davide Caruso",
        avatar: "https://i.pravatar.cc/150?img=7",
        bio: "Mi occupo di feste per bambini.",
        telefono: "+39 346 5544332",
        instagram: "@davidino_kids",
        categories: ["clown", "magia"],
        location: {
          city: "Genova",
          address: "Via XX Settembre 19",
          coordinates: { lat: 44.4071, lng: 8.9339 },
        },
      },
      {
        email: "chiara@example.com",
        password: "password123",
        name: "Chiara Bellini",
        avatar: "https://i.pravatar.cc/150?img=8",
        bio: "Direttrice artistica per eventi teatrali.",
        telefono: "+39 350 6677881",
        website: "https://chiarabellini.art",
        categories: ["teatro", "danza"],
        location: {
          city: "Verona",
          address: "Via Mazzini 22",
          coordinates: { lat: 45.4384, lng: 10.9916 },
        },
      },
      {
        email: "valerio@example.com",
        password: "password123",
        name: "Valerio Conti",
        avatar: "https://i.pravatar.cc/150?img=9",
        bio: "Producer e curatore di eventi.",
        telefono: "+39 349 6677882",
        youtube: "https://youtube.com/@valerioproductions",
        categories: ["musica", "fuoco"],
        location: {
          city: "Palermo",
          address: "Via Roma 54",
          coordinates: { lat: 38.1157, lng: 13.3615 },
        },
      },
      {
        email: "marta@example.com",
        password: "password123",
        name: "Marta Gallo",
        avatar: "https://i.pravatar.cc/150?img=10",
        bio: "Event planner e fotografa.",
        telefono: "+39 332 5566774",
        instagram: "@martagallo.photo",
        portfolio: "https://martagallo.com/gallery",
        categories: ["acrobatica", "danza aerea"],
        location: {
          city: "Catania",
          address: "Via Etnea 101",
          coordinates: { lat: 37.5079, lng: 15.083 },
        },
      },
    ]

    // Cancella vecchi dati (opzionale)
    await Customer.deleteMany()
    console.log("🧹 Vecchi clienti rimossi")

    //  Hashtag le password
    for (let customer of customers) {
      const salt = await bcrypt.genSalt(10)
      customer.password = await bcrypt.hash(customer.password, salt)
    }

    // Inserisce i dati
    await Customer.insertMany(customers)
    console.log(" 10 clienti inseriti con successo!")
    process.exit()
  } catch (error) {
    console.error(" Errore durante l'inserimento:", error)
    process.exit(1)
  }
}

seedCustomers()
