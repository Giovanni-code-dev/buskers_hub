import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Idratazione: recupera lo user dal localStorage e valida col backend
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)

      // 🔐 Controllo di sicurezza base
      if (!parsedUser?.role || !parsedUser?.token) {
        console.warn("⚠️ Utente mancante o invalido. Logout forzato.")
        logout()
        return
      }

      fetch(`${import.meta.env.VITE_BACKEND_URL}/${parsedUser.role}/me`, {
        headers: {
          Authorization: `Bearer ${parsedUser.token}`,
        },
      })
        .then((res) => {
          console.log("Risposta dal backend:", res.status)
          if (!res.ok) {
            console.warn("⚠️ Utente non valido o eliminato. Logout forzato.")
            logout()
          } else {
            setUser(parsedUser)
          }
        })
        .catch((err) => {
          console.error("Errore nella verifica utente:", err.message)
          logout()
        })
    }
  }, [])

  // Salva user e token in localStorage e aggiorna il context
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", userData.token)
    setUser(userData)
  }

  // Rimuove user e token, reindirizza alla login
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    navigate("/") // oppure una pagina di login dedicata
  }

// 🔄 Aggiorna i dati dell'utente dal backend
const refreshUser = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${user.role}/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    if (!res.ok) throw new Error("Errore nel recupero utente aggiornato")
    const freshUser = await res.json()

    const mergedUser = { ...freshUser, token: user.token, role: user.role }


    localStorage.setItem("user", JSON.stringify(mergedUser))
    setUser(mergedUser)
  } catch (err) {
    console.error("Errore nel refreshUser:", err.message)
  }
}



  
  return (
<UserContext.Provider value={{ user, login, logout, refreshUser, setUser }}>
{children}
    </UserContext.Provider>
  )
}

// 🔧 Hook custom per usare il context
export const useUser = () => useContext(UserContext)
