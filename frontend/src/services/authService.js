// authService.js

const BASE_URL = "http://localhost:3001/auth"

// Login artista
export const loginArtist = async (email, password) => {
  const res = await fetch(`${BASE_URL}/artist/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const { message } = await res.json()
    throw new Error(message || "Errore login artista")
  }

  return await res.json()
}

// Login customer
export const loginCustomer = async (email, password) => {
  const res = await fetch(`${BASE_URL}/customer/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const { message } = await res.json()
    throw new Error(message || "Errore login cliente")
  }

  return await res.json()
}

// Aggiunta funzione per la registrazione
export const registerUser = async (role, data) => {
  const res = await fetch(`${BASE_URL}/${role}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const { message } = await res.json()
    throw new Error(message || "Errore registrazione")
  }

  return await res.json()
}
