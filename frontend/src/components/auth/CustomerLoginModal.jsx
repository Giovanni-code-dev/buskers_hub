import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import LoginCustomerForm from "./LoginCustomerForm"
  
  const CustomerLoginModal = ({ trigger }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login User</DialogTitle>
            <DialogDescription>
              Inserisci email e password oppure accedi con Google.
            </DialogDescription>
          </DialogHeader>
          <LoginCustomerForm />
        </DialogContent>
      </Dialog>
    )
  }
  
  export default CustomerLoginModal
  