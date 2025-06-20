import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import LoginSelector from "./LoginSelector"
import { useNavigate } from "react-router-dom"
import buskerHubLogo from "@/assets/buskerHub.jpeg"
import LoginDropdown from "@/components/auth/LoginDropdown"



const LoginSelectorModal = () => {
  const navigate = useNavigate()

  return (
    <Dialog defaultOpen onOpenChange={(open) => {
      if (!open) navigate("/home")
    }}>
      <DialogContent
        className="max-w-4xl p-0 bg-transparent shadow-none border-none max-h-screen overflow-y-auto"
      >
        <div className="w-full bg-white rounded-xl shadow-xl p-6 space-y-6">
          {/* Titolo e descrizione sopra */}
          <div className="text-center space-y-2">
  <DialogTitle className="text-2xl font-bold font-sans">
    Benvenuto in BuskersHub
  </DialogTitle>
  <DialogDescription className="text-gray-600 font-sans">
    Scopri e ingaggia artisti straordinari per il tuo evento.
  </DialogDescription>
</div>


          {/* Immagine e Login affiancati */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <img
            src={buskerHubLogo}
            alt="Illustrazione artista"
              className="w-full h-auto object-cover rounded-lg"
            />

<LoginDropdown />

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginSelectorModal
