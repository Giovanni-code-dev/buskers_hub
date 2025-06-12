import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased relative">


      
      {/* Navbar sticky */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Contenuto con padding per non essere nascosto dalla navbar */}
      <main className="flex-grow p-4 mt-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout


