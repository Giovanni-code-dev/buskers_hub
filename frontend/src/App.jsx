import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute"
import ShowDetail from "@/pages/shows/ShowDetail"

// Layouts
import Layout from "@/components/Layout"
import LayoutArtist from "@/components/LayoutArtist"

// Pagine login & registrazione (senza layout)
import LoginSelector from "@/pages/login/LoginSelector"
import LoginCustomer from "@/pages/login/LoginCustomer"
import LoginArtist from "@/pages/login/LoginArtist"
import RedirectGoogle from "@/pages/RedirectGoogle"
import RegisterSelector from "@/pages/register/RegisterSelector"
import RegisterCustomer from "@/pages/register/RegisterCustomer"
import RegisterArtist from "@/pages/register/RegisterArtist"

// Pagine pubbliche
import HomeCustomer from "@/pages/home/HomeCustomer"
import Home from "@/pages/home/Home"
import ArtistPublicPage from "@/pages/artist/ArtistPublicPage"

// Dashboard customer (protetta)
import DashboardCustomer from "@/pages/dashboard/customer/DashboardCustomer"

// Dashboard artista (protetta)
import DashboardArtist from "@/pages/dashboard/artist/DashboardArtist"
import Packages from "@/pages/dashboard/artist/Packages"
import Project from "@/pages/dashboard/artist/Project"
import Shows from "@/pages/dashboard/artist/Shows"
import Settings from "@/pages/dashboard/artist/Settings"
import Calendar from "@/pages/dashboard/artist/Calendar"
import RequestsReceived from "@/pages/dashboard/artist/RequestsReceived"
import EditProfile from "@/pages/dashboard/artist/EditProfile" // nuovo import

function App() {
  return (

    
    <Routes>
      {/* =============================
          PAGINE SENZA LAYOUT
      ============================== */}
      <Route path="/" element={<LoginSelector />} />
      <Route path="/login/customer" element={<LoginCustomer />} />
      <Route path="/login/artist" element={<LoginArtist />} />
      <Route path="/redirect-google" element={<RedirectGoogle />} />
      <Route path="/register" element={<RegisterSelector />} />
      <Route path="/register/customer" element={<RegisterCustomer />} />
      <Route path="/register/artist" element={<RegisterArtist />} />

      {/* =============================
          LAYOUT PUBBLICO CON NAVBAR/FOOTER
      ============================== */}
      <Route element={<Layout />}>
        <Route path="/home" element={<HomeCustomer />} />
        <Route path="/artist/:id" element={<ArtistPublicPage />} />
        <Route path="/shows/:id" element={<ShowDetail />} />
      </Route>

      {/* =============================
          AREA PROTETTA - CUSTOMER
      ============================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard/customer" element={<DashboardCustomer />} />
        </Route>
      </Route>

      {/* =============================
          AREA PROTETTA - ARTIST
      ============================== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/artist" element={<LayoutArtist />}>
          <Route index element={<DashboardArtist />} />
          <Route path="shows" element={<Shows />} />
          <Route path="requests" element={<RequestsReceived />} />
          <Route path="packages" element={<Packages />} />
          <Route path="projects" element={<Project />} />
          <Route path="settings" element={<Settings />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="edit-profile" element={<EditProfile />} /> {/* nuova rotta */}
        </Route>
      </Route>
    </Routes>
  )
}

export default App
