import { Card, CardContent } from "@/components/ui/card"

const DashboardCustomer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold">Benvenuto User!</h1>
          <p className="text-muted-foreground">
          Scopri talenti straordinari, seleziona i tuoi preferiti e invia la tua richiesta.
          <Link to="/home" className="text-blue-600 underline hover:text-blue-800 transition-colors">
    La magia comincia da qui.
  </Link>
                   </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardCustomer
