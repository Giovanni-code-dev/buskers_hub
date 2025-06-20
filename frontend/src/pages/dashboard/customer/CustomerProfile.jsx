import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/UserContext"
import { Loader2 } from "lucide-react"

const CustomerProfile = () => {
  const { user } = useUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/customer/profile`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })

        if (!res.ok) throw new Error("Errore nel recupero del profilo")

        const data = await res.json()

        console.log("Dati profilo ricevuti:", data)

        setProfile(data)
      } catch (error) {
        console.error("Errore:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.token) {
      fetchProfile()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-6 text-center space-y-4">
          <Avatar className="mx-auto w-20 h-20">
            <AvatarImage src={profile?.avatar} alt={profile?.name} />
            <AvatarFallback>{profile?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{profile?.name}</h2>
          <p className="text-muted-foreground">{profile?.email}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerProfile
