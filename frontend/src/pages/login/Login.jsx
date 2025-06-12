import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Accesso</h1>

          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />

          <Button className="w-full">Accedi</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
