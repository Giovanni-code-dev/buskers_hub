import { Card, CardContent } from "@/components/ui/card"

const DashboardCustomer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold">👤 Benvenuto Cliente!</h1>
          <p className="text-muted-foreground">
            Puoi esplorare artisti, prenotare spettacoli e lasciare recensioni. Buona esperienza onirica!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardCustomer
