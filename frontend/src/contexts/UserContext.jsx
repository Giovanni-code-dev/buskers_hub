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
  
      fetch(`${import.meta.env.VITE_BACKEND_URL}/${parsedUser.role}/me`, {
        headers: {
          Authorization: `Bearer ${parsedUser.token}`,
        },
      })
        .then((res) => {
          console.log("Risposta dal backend:", res.status)
          if (!res.ok) {
            console.warn(" Utente non valido o eliminato. Logout forzato.")
            logout()
          } else {
            setUser(parsedUser)
          }
        })
        .catch((err) => {
          console.error("Errore nella verifica utente:", err)
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

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// 🔧 Hook custom per usare il context
export const useUser = () => useContext(UserContext)
