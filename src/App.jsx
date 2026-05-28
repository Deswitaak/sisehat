import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Registrasi from "./pages/registrasi";
import Beranda from "./pages/beranda";
import Profil from "./pages/profile";
import Asesmen from "./pages/asesmen"; // 🔥 WAJIB
import Hasil from "./pages/hasil";
import ProfilSelesai from "./pages/profilSelesai";
import Settings from "./pages/settings";
import EditProfile from "./pages/EditProfil";
import Perbandingan from "./pages/perbandingan";
import Rekomendasi from "./pages/rekomendasi";
import Eksplorasi from "./pages/eksplorasi";
import DetailUMKM from "./pages/detailumkm";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrasi" element={<Registrasi />} />

        <Route path="/beranda" element={<Beranda />} />

        {/* 🔥 FIX FLOW */}
        <Route path="/asesmen" element={<Asesmen />} />
        <Route path="/hasil" element={<Hasil />} />
         <Route path="/perbandingan" element={<Perbandingan />} />
        <Route path="/profile" element={<Profil />} />
        <Route path="/profil-selesai" element={<ProfilSelesai />} />
         <Route path="/perbandingan" element={<Perbandingan />} />
        <Route path="/rekomendasi" element={<Rekomendasi />} />
        <Route path="/eksplorasi" element={<Eksplorasi />} />
         <Route path="/detailumkm" element={<DetailUMKM />}/>
        <Route path="/settings" element={<Settings />} />
        <Route path="/profil" element={<EditProfile />} />
      

      </Routes>
    </BrowserRouter>
  );
}

export default App;