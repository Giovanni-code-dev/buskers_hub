import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import LoginArtistForm from "./LoginArtistForm"
  
  const ArtistLoginModal = ({ trigger }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Artista</DialogTitle>
            <DialogDescription>
              Inserisci email e password oppure accedi con Google.
            </DialogDescription>
          </DialogHeader>
          <LoginArtistForm />
        </DialogContent>
      </Dialog>
    )
  }
  
  export default ArtistLoginModal
  